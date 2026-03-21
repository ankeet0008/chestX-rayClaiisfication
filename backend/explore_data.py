import kagglehub
import os

def explore_dataset():
    print("Downloading/Locating dataset via kagglehub...")
    path = kagglehub.dataset_download("kostasdiamantaras/chest-xrays-bacterial-viral-pneumonia-normal")
    print(f"Dataset path: {path}")
    
    # List the directory structure
    for root, dirs, files in os.walk(path):
        level = root.replace(path, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f"{indent}{os.path.basename(root)}/ ({len(files)} files)")
        subindent = ' ' * 4 * (level + 1)
        if level <= 2:  # Don't print too deep if there are many subdirs
            for d in dirs:
                print(f"{subindent}{d}/")
                
if __name__ == "__main__":
    explore_dataset()
