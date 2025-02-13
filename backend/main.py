from fastapi import FastAPI, Query
import requests
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so the frontend can access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI app!"}

@app.get("/api/data")
def get_data(
    stars: int = Query(10000, description="Minimum number of stars", ge=0),
    limit: int = Query(10, description="Number of repositories to return", ge=1, le=50)
):
    url = f"https://api.github.com/search/repositories?q=stars:>{stars}&sort=stars"
    response = requests.get(url)
    data = response.json()
    df = pd.DataFrame(data.get("items", []))
    if not df.empty:
        df = df[["name", "stargazers_count", "html_url"]].head(limit)
        return df.to_dict(orient="records")
    else:
        return []
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
