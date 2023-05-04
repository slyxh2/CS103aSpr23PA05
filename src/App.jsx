import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const local = JSON.parse(localStorage.getItem('transactions'));
    const formData = new FormData(ev.target);
    const newTran = {};
    for (let pair of formData.entries()) {
      newTran[pair[0]] = pair[1];
    }
    local.push(newTran);
    localStorage.setItem('transactions', JSON.stringify(local));
    setTransactions([...transactions, newTran]);
    ev.target.reset();
  }
  const sortTransactions = (fn) => {
    const local = JSON.parse(localStorage.getItem('transactions'));
    local.sort(fn);
    setTransactions(local);
  }
  const handleDelete = (id) => {
    const isDelete = window.confirm('Are you sure to delete?');
    if (isDelete) {
      let local = JSON.parse(localStorage.getItem('transactions'));
      local = local.filter(item => item.itemId !== id);
      setTransactions(local);
      localStorage.setItem('transactions', JSON.stringify(local));
    }
  }
  const handleDate = () => {
    sortTransactions((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  }
  const handleMonth = () => {
    sortTransactions((a, b) => {
      const monthA = new Date(a.date).getMonth();
      const monthB = new Date(b.date).getMonth();
      return monthA - monthB;
    });
  }
  const handleYear = () => {
    sortTransactions((a, b) => {
      const yearA = new Date(a.date).getFullYear();
      const yearB = new Date(b.date).getFullYear();
      return yearA - yearB;
    });
  }
  const handleCategory = () => {
    const local = JSON.parse(localStorage.getItem('transactions'));
    const grouped = local.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    const plainArray = Object.values(grouped).flat();
    setTransactions(plainArray);
  }
  useEffect(() => {
    let transactions = localStorage.getItem('transactions');
    if (!transactions) {
      localStorage.setItem('transactions', '[]');
      transactions = localStorage.getItem('transactions')
    }
    console.log(transactions);
    setTransactions(JSON.parse(transactions));
  }, [])
  return (
    <div id="home">
      <div>
        <button onClick={handleDate} className="btn">summarize transactions by date</button>
        <button onClick={handleMonth} className="btn">summarize transactions by month</button>
        <button onClick={handleYear} className="btn">summarize transactions by year</button>
        <button onClick={handleCategory} className="btn">summarize transactions by category</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item id</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.map(item => (
              <tr key={item.itemId}>
                <td>{item.itemId}</td>
                <td>{item.amount}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td id="delete" onClick={() => handleDelete(item.itemId)}>X</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="itemId" placeholder='item id' />
        <input type="number" name="amount" placeholder='amount' />
        <input type="text" name="category" placeholder='category' />
        <input type="Date" name="date" />
        <input type="text" name="description" placeholder='description' />

        <button className="btn">Submit</button>
      </form>
    </div>
  );
}

export default App;
