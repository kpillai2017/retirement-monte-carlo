# Retirement Monte Carlo Simulator: VAS/VGS/VAF & BILL Buffer

A high-fidelity, client-side retirement modelling tool built to stress-test portfolio longevity against inflation, market volatility, and sequence of returns risk. This simulator is specifically designed for the **Australian investor** context, incorporating local ETF proxies and franking credit assumptions.

## 📊 Overview

This application runs **1,000 parallel simulations** over a 30-year horizon to determine the "Risk of Ruin" for a given retirement strategy. Unlike static calculators, it uses a stochastic (Monte Carlo) approach to model the randomness of market returns and CPI.

### Key Features
* **Three-Bucket Allocation**: Customise your mix of Australian Equities (VAS), International Equities (VGS), and Australian Bonds (VAF).
* **Dynamic BILL ETF Buffer**: Implements a cash-reserve strategy (using the iShares Core Cash ETF as a proxy) to weather market downturns without selling depressed assets.
* **Spending Guardrails**: Define a "Target Spend" with a hard "Floor" and "Ceiling". The model dynamically adjusts your lifestyle based on portfolio performance.
* **Sequence of Returns Risk (SORR)**: A dedicated toggle to "force" a market crash in the early years of retirement, testing the robustness of your buffer.
* **Real-Value Visualisation**: All chart outcomes are adjusted for inflation (CPI), showing you the median, 10th, and 90th percentile outcomes in "today's dollars".

## 🛠️ Technical Implementation

* **Logic**: Pure JavaScript using the Box-Muller transform for generating normally distributed random variables ($z$-scores).
* **Visuals**: Powered by **Chart.js** with a custom "Fan Chart" implementation for percentile tracking.
* **Styling**: Responsive CSS Grid layout designed for both desktop analysis and mobile viewing.
* **Version Control**: Managed via Git/GitHub for seamless updates to the simulation engine.

## 📈 Market Assumptions (2026 Context)

The simulation uses the following default annualised parameters:

| Ticker | Asset Class | Expected Return ($\mu$) | Volatility ($\sigma$) | Yield |
| :--- | :--- | :--- | :--- | :--- |
| **VAS** | Aus Equities | 8.0% | 16.0% | 4.2% (+ Franking) |
| **VGS** | Intl Equities | 7.2% | 17.0% | 1.9% |
| **VAF** | Aus Bonds | 3.8% | 5.8% | - |
| **BILL** | Cash | 4.1% | 0.3% | - |

> [!NOTE]
> **Franking Credits**: The model assumes a 75% payout ratio and a 30% corporate tax rate to calculate the grossed-up yield for Australian holdings.

## 🚀 How to Use

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/kpillai2017/retirement-sim.git](https://github.com/kpillai2017/retirement-sim.git)
    ```
2.  **Open `index.html`**: No build step or server is required. The simulation runs entirely in your browser.
3.  **Adjust Sliders**: Watch the Fan Chart and Risk of Ruin update in real-time as you tweak your asset mix and spending floor.

## ⚖️ Disclaimer

This tool is provided for educational and illustrative purposes only. It models hypothetical performance based on statistical assumptions and does not constitute financial advice. Always consult with a qualified financial professional before making investment decisions.

---
*Developed as part of a lifestyle philosophy and financial robustness blog series.*
