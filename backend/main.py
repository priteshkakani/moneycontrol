from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Literal
import yfinance as yf


app = FastAPI(title="MoneyControl Backend", version="0.1.0")

# Adjust these origins as needed for local dev and deployments
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # With wildcard origins, credentials must be disabled
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/quote/{symbol}")
def get_quote(symbol: str) -> dict:
    try:
        ticker = yf.Ticker(symbol)
        # Try fast_info first
        info = getattr(ticker, "fast_info", {}) or {}
        price = (
            info.get("lastPrice")
            or info.get("last_price")
            or info.get("regularMarketPrice")
            or info.get("last_traded_price")
        )
        currency = info.get("currency") or "INR"
        previous_close = info.get("previous_close") or info.get("previousClose")

        # Fallback: derive from recent history if price is missing/None
        if price is None:
            hist = ticker.history(period="1d")
            if hist is None or hist.empty:
                # Try a slightly longer window
                hist = ticker.history(period="5d")
            if hist is not None and not hist.empty and "Close" in hist.columns:
                price = float(hist["Close"].dropna().iloc[-1])
                if previous_close is None and len(hist["Close"].dropna()) >= 2:
                    previous_close = float(hist["Close"].dropna().iloc[-2])

        if price is None:
            raise ValueError("No price available from fast_info or history")

        return {
            "symbol": symbol.upper(),
            "price": float(price) if price is not None else None,
            "currency": currency,
            "previous_close": float(previous_close) if previous_close is not None else None,
        }
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote for {symbol}: {exc}")


@app.get("/api/history")
def get_history(
    symbol: str = Query(..., description="Ticker symbol, e.g. ^NSEI or ^NSEBANK or AAPL"),
    period: Literal[
        "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
    ] = "1mo",
    interval: Literal["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"] = "1d",
    events: Optional[Literal["div", "split", "capitalGains"]] = None,
) -> dict:
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval, events=events)
        if hist.empty:
            return {"symbol": symbol.upper(), "candles": []}
        candles = []
        # Reset index to get datetime as a column
        hist_reset = hist.reset_index()
        for row in hist_reset.itertuples(index=False):
            # yfinance returns Datetime in 'Date' or 'Datetime' depending on interval
            dt = getattr(row, "Date", None) or getattr(row, "Datetime", None)
            candles.append(
                {
                    "t": int(dt.timestamp() * 1000) if dt is not None else None,
                    "o": float(getattr(row, "Open", None) or 0),
                    "h": float(getattr(row, "High", None) or 0),
                    "l": float(getattr(row, "Low", None) or 0),
                    "c": float(getattr(row, "Close", None) or 0),
                    "v": float(getattr(row, "Volume", 0) or 0),
                }
            )
        return {"symbol": symbol.upper(), "candles": candles}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to fetch history for {symbol}: {exc}")


@app.get("/api/fundamentals/{symbol}")
def get_fundamentals(symbol: str) -> dict:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        summary = {
            "symbol": symbol.upper(),
            "longName": info.get("longName"),
            "shortName": info.get("shortName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "marketCap": info.get("marketCap"),
            "trailingPE": info.get("trailingPE"),
            "forwardPE": info.get("forwardPE"),
            "dividendYield": info.get("dividendYield"),
            "beta": info.get("beta"),
            "website": info.get("website"),
        }
        return summary
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to fetch fundamentals for {symbol}: {exc}")


# Run with: uvicorn backend.main:app --reload --port 8000

