import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle } from 'lucide-react';

export default function EasyTradeBot() {
  const [selectedStock, setSelectedStock] = useState('MSFT');
  const [accountBalance] = useState(100000);
  const [dailyTarget] = useState(450);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [trades, setTrades] = useState([]);
  const [shareSize, setShareSize] = useState(100);
  const [stockPrices, setStockPrices] = useState({
    MSFT: 398,
    TSLA: 245,
    AAPL: 182,
    NVDA: 892,
    AMZN: 185,
    GOOGL: 140,
    META: 510,
    JPM: 210,
    SPY: 550,
    QQQ: 480,
    AMD: 185,
    NFLX: 265
  });

  const stocks = Object.keys(stockPrices);
  const currentPrice = stockPrices[selectedStock];
  const positionSize = shareSize * currentPrice;
  const riskPercentage = 0.5;
  const maxRiskDollars = (accountBalance * riskPercentage) / 100;
  const suggestedTarget = dailyTarget;

  // Simulate price movement every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrices(prev => ({
        ...prev,
        [selectedStock]: prev[selectedStock] + (Math.random() - 0.5) * 2
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedStock]);

  const openTrade = () => {
    const entryPrice = currentPrice;
    const stopLoss = entryPrice * 0.98; // 2% below entry
    const takeProfit = entryPrice + (dailyTarget / shareSize); // Price needed to hit $400

    const newTrade = {
      id: Date.now(),
      stock: selectedStock,
      entryPrice,
      stopLoss,
      takeProfit,
      shares: shareSize,
      status: 'open',
      openTime: new Date().toLocaleTimeString(),
      risk: (entryPrice - stopLoss) * shareSize
    };

    setTrades([...trades, newTrade]);
  };

  const closeTrade = (tradeId, exitPrice) => {
    const updatedTrades = trades.map(trade => {
      if (trade.id === tradeId) {
        const profit = (exitPrice - trade.entryPrice) * trade.shares;
        setDailyProfit(prev => prev + profit);
        return { ...trade, status: 'closed', exitPrice, profit, closeTime: new Date().toLocaleTimeString() };
      }
      return trade;
    });
    setTrades(updatedTrades);
  };

  const openTrades = trades.filter(t => t.status === 'open');
  const closedTrades = trades.filter(t => t.status === 'closed');
  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: '700' }}>
          💰 Easy Trade Bot
        </h1>
        <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
          Your $100,000 trading assistant • Target: $400-500 daily
        </p>
      </div>

      {/* Key Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <StatCard label="Account Balance" value={`$${accountBalance.toLocaleString()}`} color="#00d4ff" />
        <StatCard label="Today's Profit" value={`$${dailyProfit.toFixed(2)}`} color={dailyProfit >= 0 ? '#00ff88' : '#ff4444'} />
        <StatCard label="Daily Target" value={`$${dailyTarget}`} color="#ffa500" />
        <StatCard 
          label="Progress to Goal" 
          value={`${((dailyProfit / dailyTarget) * 100).toFixed(0)}%`}
          color={dailyProfit >= dailyTarget ? '#00ff88' : '#00d4ff'}
        />
      </div>

      {/* Stock Selector */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
          📊 Pick a Stock to Trade:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' }}>
          {stocks.map(stock => (
            <button
              key={stock}
              onClick={() => setSelectedStock(stock)}
              style={{
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: selectedStock === stock ? '#00ff88' : '#2a2a4e',
                color: selectedStock === stock ? '#000' : '#fff',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {stock} <br /> ${currentPrice.toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Setup */}
      <div style={{
        background: '#2a2a4e',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #00d4ff'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
          ⚙️ Set Up Your Trade
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            How many shares do you want to buy?
          </label>
          <input
            type="range"
            min="10"
            max="500"
            value={shareSize}
            onChange={(e) => setShareSize(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '14px', color: '#aaa', marginTop: '8px' }}>
            {shareSize} shares = ${positionSize.toFixed(2)} (Risk: ${((positionSize * 0.02).toFixed(2))})
          </div>
        </div>

        <div style={{ 
          background: '#1a1a2e',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>📍 Entry Price:</strong> ${currentPrice.toFixed(2)}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>🛑 Stop Loss (Safety):</strong> ${(currentPrice * 0.98).toFixed(2)} (2% below entry)
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>🎯 Profit Target:</strong> ${(currentPrice + (dailyTarget / shareSize)).toFixed(2)}
          </div>
          <div style={{ marginTop: '12px', padding: '10px', background: '#00d4ff20', borderRadius: '6px', color: '#00ff88' }}>
            <strong>Expected Profit if Target Hits:</strong> ${dailyTarget.toFixed(2)}
          </div>
        </div>

        <button
          onClick={openTrade}
          style={{
            width: '100%',
            padding: '14px',
            background: '#00ff88',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#00dd77'}
          onMouseOut={(e) => e.target.style.background = '#00ff88'}
        >
          ✅ Open Trade Now
        </button>
      </div>

      {/* Open Trades */}
      {openTrades.length > 0 && (
        <div style={{
          background: '#2a2a4e',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #ffa500'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            🔴 Active Trades ({openTrades.length})
          </h2>
          {openTrades.map(trade => (
            <div key={trade.id} style={{
              background: '#1a1a2e',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px', fontSize: '13px' }}>
                <div><strong>{trade.stock}</strong> • {trade.shares} shares</div>
                <div>Entry: ${trade.entryPrice.toFixed(2)}</div>
                <div>Stop Loss: ${trade.stopLoss.toFixed(2)}</div>
                <div>Target: ${trade.takeProfit.toFixed(2)}</div>
              </div>
              <button
                onClick={() => closeTrade(trade.id, currentPrice)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Close Trade at ${currentPrice.toFixed(2)}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Closed Trades */}
      {closedTrades.length > 0 && (
        <div style={{
          background: '#2a2a4e',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #00ff88'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
            ✅ Completed Trades ({closedTrades.length})
          </h2>
          {closedTrades.map(trade => (
            <div key={trade.id} style={{
              background: '#1a1a2e',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: `4px solid ${trade.profit >= 0 ? '#00ff88' : '#ff4444'}`
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px', marginBottom: '8px' }}>
                <div><strong>{trade.stock}</strong> • {trade.shares} shares</div>
                <div style={{ color: trade.profit >= 0 ? '#00ff88' : '#ff4444', fontWeight: '600' }}>
                  {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                </div>
                <div>Entry: ${trade.entryPrice.toFixed(2)} → Exit: ${trade.exitPrice.toFixed(2)}</div>
                <div>{trade.openTime} → {trade.closeTime}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
