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
    print("=" * 60)
    
    print("\n[1/4] Preparing dataset via kagglehub...")
    dataset_path = ""
    for attempt in range(1, 11):
        try:
            dataset_path = kagglehub.dataset_download("kostasdiamantaras/chest-xrays-bacterial-viral-pneumonia-normal")
            break
        except Exception:
            if attempt == 10: raise
            time.sleep(5)
            
    labels_csv = os.path.join(dataset_path, "labels_train.csv")
    raw_images_dir = os.path.join(dataset_path, "train_images")
    if os.path.isdir(os.path.join(raw_images_dir, "train_images")):
        raw_images_dir = os.path.join(raw_images_dir, "train_images")
        
    arranged_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "arranged_train"))
    
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
            print(f"Added {count} new images to arranged folders.")
                    
    train_dir = arranged_dir
    print(f"Dataset ready at: {train_dir}")
    
    # 2. Load Images and Features
    print("\n[2/4] Extracting features from images (resizing to 64x64 Grayscale)...")
    target_size = (64, 64)
    data = []
    labels = []
    
    classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    classes.sort()
    
    for class_idx, class_name in enumerate(classes):
        class_folder = os.path.join(train_dir, class_name)
        img_count = 0
        for img_name in os.listdir(class_folder):
            if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                img_path = os.path.join(class_folder, img_name)
                try:
                    img = Image.open(img_path).convert('L')
                    img = img.resize(target_size)
                    img_array = np.array(img).flatten() # Flatten 2D into 1D feature vector
                    data.append(img_array)
                    labels.append(class_idx)
                    img_count += 1
                except Exception:
                    pass
        print(f"   Loaded {img_count} images for class '{class_name}'")
    
    X = np.array(data)
    y = np.array(labels)
    
    print(f"Extracted {len(X)} total images. Feature vector size: {X.shape[1]}")
    print(f"Classes: {classes}")

    if len(X) == 0:
        print("No images found! Cannot train.")
        return

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Train Scikit-Learn Model
    print("\n[3/4] Training Random Forest model...")
    start_time = time.time()
    
    # Using RandomForestClassifier: robust, handles tabular well, default 100 trees
    model = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
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
