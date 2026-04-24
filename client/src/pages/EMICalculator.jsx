import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatPrice } from '../utils/constants';
import { HiCurrencyRupee, HiCalculator } from 'react-icons/hi';

const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  const emi = monthlyRate > 0
    ? Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1))
    : Math.round(principal / months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const yearlyBreakdown = [];
  let balance = principal;
  for (let year = 1; year <= tenure && year <= 30; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      const principalPart = emi - interest;
      yearInterest += interest;
      yearPrincipal += principalPart;
      balance -= principalPart;
    }
    yearlyBreakdown.push({
      year: `Y${year}`,
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EMI Calculator</h1>
        <p className="text-gray-500">Calculate your home loan EMI and view the amortization schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="card p-6 space-y-6">
          <h2 className="font-semibold text-lg flex items-center gap-2"><HiCalculator className="w-5 h-5 text-blue-600" /> Loan Details</h2>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-600">Loan Amount</label>
              <span className="text-sm font-bold text-blue-600">{formatPrice(principal)}</span>
            </div>
            <input type="range" min="500000" max="100000000" step="100000" value={principal}
              onChange={e => setPrincipal(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400"><span>5L</span><span>10Cr</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-600">Interest Rate</label>
              <span className="text-sm font-bold text-blue-600">{rate}%</span>
            </div>
            <input type="range" min="5" max="20" step="0.1" value={rate}
              onChange={e => setRate(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400"><span>5%</span><span>20%</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-600">Tenure</label>
              <span className="text-sm font-bold text-blue-600">{tenure} years</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={tenure}
              onChange={e => setTenure(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400"><span>1 yr</span><span>30 yrs</span></div>
          </div>

          {/* EMI Result */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
            <p className="text-3xl font-bold text-blue-600">{formatPrice(emi)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total Payment</p>
              <p className="text-sm font-bold text-gray-900">{formatPrice(totalPayment)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total Interest</p>
              <p className="text-sm font-bold text-red-600">{formatPrice(totalInterest)}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatPrice(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amortization */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Yearly Amortization</h3>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={yearlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => formatPrice(v)} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatPrice(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="principal" stroke="#3b82f6" name="Principal" strokeWidth={2} />
                  <Line type="monotone" dataKey="interest" stroke="#ef4444" name="Interest" strokeWidth={2} />
                  <Line type="monotone" dataKey="balance" stroke="#10b981" name="Balance" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
