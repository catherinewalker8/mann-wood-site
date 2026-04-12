import geopandas as gpd
import os
import random
from shapely.geometry import Point

# 1. Setup absolute paths so it doesn't matter where you run the script from
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_GPKG = os.path.join(BASE_DIR, "gis_data", "mannwood_layers.gpkg") # Update filename
OUTPUT_DIR = os.path.join(BASE_DIR, "client", "public", "data")

# 2. Load Compartments
# Change layer name to whatever yours is named in QGIS
gdf_comp = gpd.read_file(INPUT_GPKG, layer="woodland_compartments").to_crs(epsg=4326)

# 3. Generate Dummy Trees
all_trees = []
for _, row in gdf_comp.iterrows():
    years = row.get('years_since_cut', 10)
    # Generate ~20 trees per compartment for testing
    for _ in range(20):
        b = row.geometry.bounds
        pnt = Point(random.uniform(b[0], b[2]), random.uniform(b[1], b[3]))
        if row.geometry.contains(pnt):
            all_trees.append({
                'geometry': pnt,
                'species': random.choice(['Oak', 'Hornbeam', 'Birch', 'Sweet Chestnut', 'Lime', 'Ash', 'Field Maple']),
                'dbh_cm': (years * random.uniform(0.5, 1.5)) + 10,
                'disease': random.choice(['None', 'None', 'Ash Dieback']),
                'last_cut': 2026 - years
            })

trees_gdf = gpd.GeoDataFrame(all_trees, crs="EPSG:4326")

# 4. Export to the Vite Public folder
gdf_comp.to_file(os.path.join(OUTPUT_DIR, "compartments.json"), driver='GeoJSON')
trees_gdf.to_file(os.path.join(OUTPUT_DIR, "trees.json"), driver='GeoJSON')

print(f"Success! Files saved to {OUTPUT_DIR}")