from fastapi import FastAPI

app = FastAPI(title="Inventario API")

@app.get("/")
def root():
    return {"ok": True}
