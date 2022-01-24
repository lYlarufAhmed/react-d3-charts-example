import './App.css';
import {useEffect, useState} from "react";
import BoxPlot from "./BoxPlot";

const datas = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30]
]
var i = 0;

function App() {

    const [data, setData] = useState([]);

    useEffect(() => {
        changeData();
    }, []);

    const prepareGraphDimension = () => {
        const margin = {top: 10, right: 30, bottom: 30, left: 40}
        return {
            margin,
            width: 460 - margin.left - margin.right,
            height: 400 - margin.top - margin.bottom
        }
    }

    const {margin, width, height} = prepareGraphDimension()

    const changeData = () => {
        setData(datas[i++]);
        if (i === datas.length) i = 0;
    }
    return (
        <div className="App">
            <h2>Box Plot with React and D3 charts</h2>
            <button onClick={changeData}>Change Data</button>
            <BoxPlot width={width} height={height} margin={margin} data={data}/>
        </div>
    );
}

export default App;
