import geopandas as gpd
import os
import random
from shapely.geometry import Point

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_GPKG = os.path.join(BASE_DIR, "gis_data", "mannwood_layers.gpkg") 
OUTPUT_DIR = os.path.join(BASE_DIR, "client", "public", "data")

# Load and reproject
gdf_comp = gpd.read_file(INPUT_GPKG, layer="compartment_approx._last_cut").to_crs(epsg=4326)

species_list = ['Oak', 'Hornbeam', 'Birch', 'Hazel', 'Sweet Chestnut', 'Field Maple', 'Ash', 'Lime']

all_trees = []
for _, row in gdf_comp.iterrows():
    # Capture age for coloring the polygons later
    age = row.get('years_since_cut', 10) 
    
    # High Density: 150 trees per compartment
    count = 0
    while count < 150:
        b = row.geometry.bounds
        pnt = Point(random.uniform(b[0], b[2]), random.uniform(b[1], b[3]))
        if row.geometry.contains(pnt):
            all_trees.append({
                'geometry': pnt,
                'species': random.choice(species_list),
                'dbh_cm': round((age * random.uniform(0.4, 1.1)) + 5, 1),
                'comp_id': row.get('id', 'unknown')
            })
            count += 1

trees_gdf = gpd.GeoDataFrame(all_trees, crs="EPSG:4326")

# Export to JSON
gdf_comp.to_file(os.path.join(OUTPUT_DIR, "compartments.json"), driver='GeoJSON')
trees_gdf.to_file(os.path.join(OUTPUT_DIR, "trees.json"), driver='GeoJSON')

print(f"Success: {len(all_trees)} trees generated across compartments.")