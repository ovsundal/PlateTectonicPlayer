"""
Muller Paleogeographic Data Preprocessor
=========================================
Converts a Muller GPKG or Shapefile into per-timestep GeoJSON snapshots
for use with the Plate Tectonic Player web app.

Usage:
    pip install -r scripts/requirements.txt
    python scripts/preprocess_muller.py --input path/to/muller.gpkg --output public/data/muller

Each output file is named plates_{N}Ma.geojson (e.g. plates_0Ma.geojson, plates_5Ma.geojson, ...)
and covers ages 0 to 750 Ma in steps of 5 Ma (~151 files total).
"""

import os
import sys
import logging
import click
import geopandas as gpd

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

AGE_MIN = 0
AGE_MAX = 750
AGE_STEP = 5


def detect_age_column(gdf: gpd.GeoDataFrame) -> str:
    """Return the name of the age column, checking common variants."""
    candidates = ["reconstruction_age", "age", "AGE", "Age", "RECONSTRUCTION_AGE"]
    for col in candidates:
        if col in gdf.columns:
            logger.info(f"Detected age column: '{col}'")
            return col
    available = list(gdf.columns)
    raise ValueError(
        f"Could not find an age column. Available columns: {available}. "
        "Pass a file whose schema includes one of: " + ", ".join(candidates)
    )


@click.command()
@click.option(
    "--input",
    "input_path",
    required=True,
    type=click.Path(exists=True),
    help="Path to Muller GPKG or Shapefile.",
)
@click.option(
    "--output",
    "output_dir",
    required=True,
    type=click.Path(),
    help="Target directory for output GeoJSON files (e.g. public/data/muller).",
)
def main(input_path: str, output_dir: str) -> None:
    """Convert Muller plate data into per-timestep GeoJSON snapshots."""
    os.makedirs(output_dir, exist_ok=True)

    logger.info(f"Reading input file: {input_path}")
    gdf = gpd.read_file(input_path)
    logger.info(f"Loaded {len(gdf)} features from input file.")

    age_col = detect_age_column(gdf)

    ages = range(AGE_MIN, AGE_MAX + AGE_STEP, AGE_STEP)
    written = 0
    skipped = 0

    for age in ages:
        logger.info(f"Processing age: {age} Ma")
        slice_gdf = gdf[gdf[age_col] == age]

        if slice_gdf.empty:
            logger.warning(f"  No features found for age {age} Ma — skipping.")
            skipped += 1
            continue

        # Ensure WGS84 for GeoJSON output
        if slice_gdf.crs is not None and slice_gdf.crs.to_epsg() != 4326:
            slice_gdf = slice_gdf.to_crs(epsg=4326)

        out_path = os.path.join(output_dir, f"plates_{age}Ma.geojson")
        slice_gdf.to_file(out_path, driver="GeoJSON")
        written += 1

    logger.info(
        f"Done. Wrote {written} GeoJSON files to '{output_dir}'. "
        f"Skipped {skipped} ages with no data."
    )
    if skipped > 0:
        sys.exit(0)  # Non-zero only on hard errors; missing ages are warnings


if __name__ == "__main__":
    main()
