# Stochastic Retirement Modeling Framework (Monte Carlo)

### ⚖️ IMPORTANT LEGAL DISCLAIMER
**This software is a technical tool for mathematical modeling and educational purposes only.**

* **NOT FINANCIAL ADVICE:** The author is not a financial planner or a licensed investment advisor. This repository does not provide financial advice, recommendations, or invitations to invest in any financial product.
* **ILLUSTRATIVE DATA ONLY:** Any default values, asset allocations, or specific tickers (e.g., VAS, VGS, VAF) provided within the code or documentation are **placeholder examples** used to demonstrate the software's functionality. They are not suggested targets, forecasts, or endorsements of those products.
* **MODEL LIMITATIONS:** Monte Carlo simulations are probabilistic models based on historical assumptions. They are mathematical abstractions and cannot predict future market performance or guarantee specific outcomes.
* **USE AT YOUR OWN RISK:** This code is provided "as is" without warranty of any kind. The author assumes no liability for financial decisions made, or losses incurred, based on the use of this simulation. 
* **AUSTRALIAN CONTEXT:** While the logic may include parameters for franking credits or Australian tax environments, this is for technical modeling purposes only. Always consult with a licensed financial professional before making retirement or investment decisions.

---

## Overview
This project is a high-fidelity, client-side stochastic simulation engine. It is designed to help researchers, developers, and students explore the mathematical impact of **Sequence of Returns Risk** and dynamic spending rules on long-term portfolio longevity.

The framework executes 1,000 parallel simulations over a 30-year horizon to calculate the statistical **"Risk of Ruin"** based on user-defined inputs and variables.

## Technical Features
* **Stochastic Engine:** Uses a Monte Carlo approach to model variance in market returns and inflation over time.
* **Three-Bucket Modeling:** Capable of simulating a diversified portfolio across Domestic Equities, International Equities, and Fixed Income.
* **Dynamic Spending Guardrails:** Implements programmable logic for "floors" and "ceilings" to test spending flexibility during periods of market volatility.
* **Cash Buffer Logic:** Includes a simulation module for a liquid cash reserve to observe the effect on share liquidation during market downturns.

## Simulation Variables
The framework is fully customisable, allowing users to input their own data for:
* **Asset Allocation:** User-defined weights for various asset classes.
* **Return Assumptions:** Custom volatility (standard deviation) and mean return inputs.
* **Tax & Credits:** Logic to account for variables such as franking credits to test the model's accuracy in specific fiscal environments.

## Getting Started

### Prerequisites
* A modern web browser (Chrome, Firefox, or Safari).
* Basic knowledge of Git and local file hosting.

### Local Installation
1.  Clone the repository:
    ```bash
    git clone [https://github.com/kpillai2017/retirement-monte-carlo.git](https://github.com/kpillai2017/retirement-monte-carlo.git)
    ```
2.  Navigate to the directory and open `index.html` in your browser. No complex build steps or backend servers are required.

## Purpose of the Project
This tool was developed to bridge the gap between abstract financial theory and practical mathematical modeling. By providing an open-source framework, it allows for transparent peer review of the formulas and logic used to simulate long-term portfolio sustainability.
