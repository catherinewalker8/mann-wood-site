import os

# Get the folder we are currently in
base_dir = os.path.dirname(os.path.abspath(__file__))
gis_folder = os.path.join(base_dir, "gis_data")

print(f"--- FOLDER DIAGNOSTIC ---")
print(f"Current Directory: {base_dir}")

if not os.path.exists(gis_folder):
    print(f"❌ ERROR: The folder 'gis_data' does not exist in {base_dir}")
    print(f"Available folders here: {[d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]}")
else:
    print(f"✅ 'gis_data' folder found.")
    files = os.listdir(gis_folder)
    print(f"Files inside 'gis_data': {files}")
    
    gpkgs = [f for f in files if f.endswith('.gpkg')]
    if gpkgs:
        print(f"Found GPKG: {gpkgs[0]}")
        print(f"👉 COPY THIS NAME EXACTLY: {gpkgs[0]}")
    else:
        print("❌ ERROR: No .gpkg files found inside 'gis_data'.")