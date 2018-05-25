# PS_LG

## Ejercicio 1

La funcionalidad requerida está en `utils.py`.

He creado una pequeña api para exponer estas funcionalidades.

Podemos arrancar la api de dos maneras:

### Docker

```bash
./build.sh
./start.sh
```

### Native

```bash
pip3 install -r requirements.txt
python3 run.py
```

La api se ejecutará en http://localhost:4423

### Ejemplos de llamadas con Curl:

```bash
curl http://localhost:4423/is_perfect/12
curl http://localhost:4423/is_abundant/12
curl http://localhost:4423/is_deficient/12
curl --header "Content-Type: application/json" --request POST --data '[10, 1000]' http://localhost:4423/type_value_list
```

### Ejemplos de llamadas con requests:

```python
requests.get('http://localhost:4423/is_perfect/123').json()
requests.get('http://localhost:4423/is_abundant/123').json()
requests.get('http://localhost:4423/is_deficient/123').json()
requests.post('http://localhost:4423/type_value_list', json=[10, 1000]).json()
```

## Ejercicio 2

Para instalar las dependencias y arrancar el server http:

```bash
npm install
npm start
```

La web se ejecutará en http://localhost:8080