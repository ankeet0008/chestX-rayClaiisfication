import os
import time
import shutil
import csv
import json
import kagglehub
import numpy as np
from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("=" * 60)
    print(" ChestXR Scikit-Learn Model Training Pipeline")
    arranged_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "arranged_train"))
    
    print("\n[1/4] Preparing dataset via kagglehub (Optional)...")
    try:
        dataset_path = ""
        for attempt in range(1, 4): # Reduced attempts
            try:
                dataset_path = kagglehub.dataset_download("kostasdiamantaras/chest-xrays-bacterial-viral-pneumonia-normal")
                break
            except Exception:
                if attempt == 3: raise
                time.sleep(2)
                
        labels_csv = os.path.join(dataset_path, "labels_train.csv")
        raw_images_dir = os.path.join(dataset_path, "train_images")
        if os.path.isdir(os.path.join(raw_images_dir, "train_images")):
            raw_images_dir = os.path.join(raw_images_dir, "train_images")
            
        if os.path.exists(labels_csv) and os.path.exists(raw_images_dir):
            class_mapping = {"0": "Normal", "1": "Bacterial_Pneumonia", "2": "Viral_Pneumonia"}
            os.makedirs(arranged_dir, exist_ok=True)
            for c in class_mapping.values():
                os.makedirs(os.path.join(arranged_dir, c), exist_ok=True)
                
            with open(labels_csv, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                next(reader)
                count = 0
                for row in reader:
                    if len(row) < 2: continue
                    fname, cid = row[0], row[1]
                    src = os.path.join(raw_images_dir, fname)
                    dst = os.path.join(arranged_dir, class_mapping.get(cid, "Unknown"), fname)
                    if os.path.exists(src) and not os.path.exists(dst):
                        shutil.copy2(src, dst)
                        count += 1
            if count > 0:
                print(f"Added {count} new images from Kaggle to arranged folders.")
    except Exception as e:
        print(f"Note: Could not refresh data from Kaggle ({e}). Using existing data in 'data/arranged_train'.")
                    
    train_dir = arranged_dir
    print(f"Dataset ready at: {train_dir}")
    
    # 2. Load Images and Features
    # Resizing to 96x96 for a better balance between detail and speed
    print("\n[2/4] Extracting features from images (resizing to 96x96 Grayscale)...")
    target_size = (96, 96)
    data = []
    labels = []
    
    # Get all subdirectories in arranged_dir as classes
    classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    classes.sort()
    
    import glob
    
    for class_idx, class_name in enumerate(classes):
        class_folder = os.path.join(train_dir, class_name)
        img_count = 0
        # Recursive search for images in case user nested them (e.g., COVID/images/*.jpg)
        pattern = os.path.join(class_folder, "**", "*.[jJ][pP]*[gG]")
        img_paths = glob.glob(pattern, recursive=True)
        # Also include PNGs
        pattern_png = os.path.join(class_folder, "**", "*.[pP][nN][gG]")
        img_paths.extend(glob.glob(pattern_png, recursive=True))
        
        for img_path in img_paths:
            try:
                img = Image.open(img_path).convert('L')
                img = img.resize(target_size, Image.Resampling.LANCZOS) # Using Lanczos for better resizing quality
                img_array = np.array(img).flatten() # Flatten 2D into 1D feature vector
                data.append(img_array.astype(np.float32) / 255.0) # Normalize pixels to [0, 1]
                labels.append(class_idx)
                img_count += 1
            except Exception:
                pass
        print(f"   Loaded {img_count} images for class '{class_name}'")
    
    X = np.array(data)
    y = np.array(labels)
    
    print(f"\nExtracted {len(X)} total images. Feature vector size: {X.shape[1]} (96x96)")
    print(f"Classes: {classes}")

    if len(X) == 0:
        print("No images found! Cannot train.")
        return

    # Check class distribution
    if len(classes) > 0:
        counts = [np.sum(y == i) for i in range(len(classes))]
        for cls, count in zip(classes, counts):
            print(f"   - {cls}: {count} images")

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None)

    # 3. Train Scikit-Learn Model
    print("\n[3/4] Training HistGradientBoostingClassifier model...")
    print("      (Using Gradient Boosting for improved accuracy)")
    start_time = time.time()
    
    from sklearn.ensemble import HistGradientBoostingClassifier
    
    # HistGradientBoosting is typically more accurate on high-dimensional data than RF
    model = make_pipeline(
        StandardScaler(), 
        HistGradientBoostingClassifier(
            max_iter=150,           # Number of boosting iterations
            learning_rate=0.1,      # Learning rate
            random_state=42, 
            l2_regularization=0.5, # Reduced overfitting
            max_leaf_nodes=63     # Complexity
        )
    )
    model.fit(X_train, y_train)
    
    train_time = time.time() - start_time
    print(f"Training completed in {train_time:.1f} seconds.")
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nValidation Accuracy: {acc*100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=classes))
    
    # 4. Save Model
    print("\n[4/4] Saving Scikit-Learn model to .pkl ...")
    model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model")
    os.makedirs(model_dir, exist_ok=True)
    
    # Remove old PyTorch model if it exists to clean up
    old_pt_path = os.path.join(model_dir, "chestxr_model.pt")
    if os.path.exists(old_pt_path):
        os.remove(old_pt_path)
    
    model_path = os.path.join(model_dir, "chestxr_sklearn.pkl")
    joblib.dump(model, model_path)
    
    classes_path = os.path.join(model_dir, "classes.json")
    with open(classes_path, "w") as f:
        json.dump(classes, f)
        
    print(f"Model saved to: {model_path}")
    print("\n🎉 Scikit-Learn Training Complete! The backend will automatically use the new .pkl model.")

if __name__ == "__main__":
    main()
