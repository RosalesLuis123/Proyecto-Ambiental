import ee
import json
import datetime

# Autenticar y inicializar GEE
ee.Authenticate()
ee.Initialize()

def process_images():
    # Ejemplo: Procesar imágenes Sentinel-2 para detectar deforestación en Chiquitanía
    region = ee.Geometry.Rectangle([-64, -18, -63, -17])  # Chiquitanía
    collection = (ee.ImageCollection('COPERNICUS/S2')
                  .filterBounds(region)
                  .filterDate('2025-01-01', '2025-04-23')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
                  .select(['B4', 'B3', 'B2']))

    # Generar un mapa de calor simulado
    image = collection.median()
    return [{
        "type": "satellite_image",
        "location": {
            "type": "Point",
            "coordinates": [-63.5, -17.5]
        },
        "url": image.getMapId()['tile_fetcher'].url_format,
        "timestamp": datetime.datetime.now().isoformat()
    }]

if __name__ == "__main__":
    images = process_images()
    print(json.dumps(images))