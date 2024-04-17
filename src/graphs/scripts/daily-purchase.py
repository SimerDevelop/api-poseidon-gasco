import pandas as pd
import sys
import matplotlib.pyplot as plt
import matplotlib as mpl
import matplotlib.dates as mdates
from io import BytesIO
import base64
import os
import uuid

# Obtener la ruta al archivo CSV desde los argumentos
csv_file_path = sys.argv[1]

# Leer el archivo CSV utilizando pandas
data_from_node = pd.read_csv(csv_file_path)

# Ordenar los datos por masa
data_from_node = data_from_node.sort_values(by='Fecha Inicial')

plt.style.use("fivethirtyeight")

mpl.rcParams['font.size'] = 8
mpl.rcParams['grid.color'] = "black"

# Crear la figura y el eje
fig, ax = plt.subplots()

# Graficar el total en el tiempo
ax.plot(data_from_node['Fecha Inicial'], data_from_node['Total'])

# Rotar las etiquetas del eje x para que sean legibles
plt.xticks(rotation=45)

# Agregar etiquetas y título al gráfico
# Agregar etiquetas y título al gráfico con espacio y negrita
ax.set_xlabel('Fecha', labelpad=10, fontweight='bold')
ax.set_ylabel('Total', labelpad=10, fontweight='bold')
ax.set_title('Compra Diaria', pad=20, fontweight='bold')

# Agregar padding alrededor del gráfico
fig.subplots_adjust(left=0.15, right=0.9, bottom=0.2, top=0.9)

# Generar un nombre único para el archivo PNG
unique_filename = str(uuid.uuid4()) + '.png'

# Guardar el gráfico en un archivo PNG en la ubicación deseada con el nombre único y mayor resolución
filename = 'C:/xampp/htdocs/sistema_registros/backend/src/temp/' + unique_filename
# filename = '/var/www/html/backend/temp/' + unique_filename
plt.savefig(filename, dpi=300)

# Obtener la ruta completa del archivo PNG
filepath = os.path.abspath(filename)

# Devolver el nombre del archivo PNG generado
sys.stdout.write(unique_filename)