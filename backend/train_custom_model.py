import os
import kagglehub
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms
import time
import posixpath
import shutil
import csv
import json

# 1. Define the Neural Network Architecture
class ChestXRNet(nn.Module):
    """
    A lightweight, custom Convolutional Neural Network designed to run 
    efficiently on CPUs for demonstration and integration purposes.
    For production, consider replacing this with ResNet50 or DenseNet121.
    """
    def __init__(self, num_classes):
        super(ChestXRNet, self).__init__()
        self.features = nn.Sequential(
            # Input: 3 x 224 x 224 -> Output: 16 x 112 x 112
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Input: 16 x 112 x 112 -> Output: 32 x 56 x 56
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Input: 32 x 56 x 56 -> Output: 64 x 28 x 28
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Input: 64 x 28 x 28 -> Output: 128 x 14 x 14
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 14 * 14, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

def main():
    print("=" * 60)
    print(" ChestXR Model Training Pipeline") # Removed emoji for cross-platform compatibility
    print("=" * 60)
    
    # Check device availability
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 2. Download Dataset with Retry Logic
    print("\n[1/5] Downloading dataset via kagglehub (with retries)...")
    
    max_retries = 10
    dataset_path = ""
    
    for attempt in range(1, max_retries + 1):
        try:
            dataset_path = kagglehub.dataset_download("kostasdiamantaras/chest-xrays-bacterial-viral-pneumonia-normal")
            break
        except Exception as e:
            print(f"   [!] Download failed on attempt {attempt}/{max_retries}: {e}")
            if attempt == max_retries:
                raise e
            print("   Retrying in 5 seconds...")
            time.sleep(5)
            
    print(f"Dataset downloaded/located at: {dataset_path}")

    # 3. Locate or Arrange Training Directory
    labels_csv = os.path.join(dataset_path, "labels_train.csv")
    raw_images_dir = os.path.join(dataset_path, "train_images")
    if os.path.isdir(os.path.join(raw_images_dir, "train_images")):
        raw_images_dir = os.path.join(raw_images_dir, "train_images")
        
    train_dir = ""
    
    if os.path.exists(labels_csv) and os.path.exists(raw_images_dir):
        arranged_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "arranged_train"))
        print(f"Restructuring Kaggle format to {arranged_dir}...")
        class_mapping = {"0": "Normal", "1": "Bacterial_Pneumonia", "2": "Viral_Pneumonia"}
        os.makedirs(arranged_dir, exist_ok=True)
        for c in class_mapping.values():
            os.makedirs(os.path.join(arranged_dir, c), exist_ok=True)
            
        with open(labels_csv, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # skip header
            count = 0
            for row in reader:
                if len(row) < 2: continue
                fname, cid = row[0], row[1]
                src = os.path.join(raw_images_dir, fname)
                dst = os.path.join(arranged_dir, class_mapping.get(cid, "Unknown"), fname)
                if os.path.exists(src) and not os.path.exists(dst):
                    shutil.copy2(src, dst)
                count += 1
        train_dir = arranged_dir
        print(f"Finished arranging {count} images into class folders.")
    else:
        # Fallback to standard ImageFolder directory structure if CSV doesn't exist
        for root, dirs, files in os.walk(dataset_path):
            if 'train_images' in dirs and not os.path.exists(labels_csv):
                train_dir = os.path.join(root, 'train_images')
                break
            elif any('normal' in d.lower() or 'pneumonia' in d.lower() for d in dirs):
                train_dir = root
                break
        if not train_dir:
            train_dir = dataset_path
        
    print(f"Using image directory containing class folders: {train_dir}")

    # 4. Prepare Data Loaders
    print("\n[2/5] Preparing data and transformations...")
    # Standard deep learning image preprocessing (resize to 224x224, normalize to ImageNet standards)
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    dataset = datasets.ImageFolder(train_dir, transform=transform)
    classes = dataset.classes
    num_classes = len(classes)
    
    print(f"Found {len(dataset)} images.")
    print(f"Classes detected ({num_classes}): {classes}")

    # For faster execution during this process, we use a random subset if the dataset is large
    # (Comment the subset lines below to train on the full dataset)
    total_images = len(dataset)
    # --- UNCOMMENT BELOW IF YOU WANT TO LIMIT THE NUMBER OF IMAGES FOR FAST CPU TRAINING ---
    # subset_size = min(total_images, 1500)  # Use max 1500 images for quick training
    # if subset_size < total_images:
    #     print(f"Warning: Using a random subset of {subset_size} images for faster CPU training!")
    #     dataset, _ = random_split(dataset, [subset_size, total_images - subset_size])
    
    # Split into train/val
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_data, val_data = random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_data, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_data, batch_size=32, shuffle=False)
    print(f"Train batches: {len(train_loader)} | Val batches: {len(val_loader)}")

    # 5. Initialize Model, Loss, Optimizer
    print("\n[3/5] Initializing Neural Network...")
    model = ChestXRNet(num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    # 6. Train the Model
    epochs = 3  # Increase epochs for better accuracy in production
    print(f"\n[4/5] Starting training loop for {epochs} epoch(s)...")
    
    for epoch in range(epochs):
        start_time = time.time()
        
        # Training Phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            if (batch_idx + 1) % 10 == 0:
                print(f"   Epoch {epoch+1} | Batch {batch_idx+1}/{len(train_loader)} | Loss: {loss.item():.4f}")
                
        train_acc = 100. * correct / total
        
        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
                
        val_acc = 100. * val_correct / val_total
        epoch_time = time.time() - start_time
        
        print(f"✅ Epoch {epoch+1} Summary ({epoch_time:.0f}s):")
        print(f"   Train Loss: {running_loss/len(train_loader):.4f} | Train Acc: {train_acc:.2f}%")
        print(f"   Val Loss:   {val_loss/len(val_loader):.4f} | Val Acc:   {val_acc:.2f}%\n")

    # 7. Save Model & Metadata
    print("[5/5] Saving model and class metadata...")
    # Ensure model directory exists
    model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model")
    os.makedirs(model_dir, exist_ok=True)
    
    # Save the PyTorch Model
    model_path = os.path.join(model_dir, "chestxr_model.pt")
    
    # It is recommended to use model.state_dict(), but for simplicity and drop-in support 
    # in the existing predictor.py, we save the full model object.
    torch.save(model, model_path)
    print(f"Model saved to: {model_path}")
    
    # Save Class Names to JSON for backend auto-discovery
    classes_path = os.path.join(model_dir, "classes.json")
    with open(classes_path, "w") as f:
        json.dump(classes, f)
        
    print(f"Classes saved to: {classes_path}")
    print("\n🎉 Training Complete! You can now restart the FastAPI backend server.")
    print("The API will automatically load this newly trained model and update its prediction classes.")

if __name__ == "__main__":
    main()
