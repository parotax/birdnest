import ViolationTable from "./components/ViolationTable";
import Header from "./components/Header";
import Map from "./components/Map";
import "./styles.css";

const App = () => {
  return (
    <>
      <Header />
      <div className="main-div">
        <Map />
        <ViolationTable />
      </div>
    </>
  );
};

export default App;
