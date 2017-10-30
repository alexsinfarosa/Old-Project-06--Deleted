import { observable, action, computed } from "mobx";
import { matchIconsToStations } from "utils";
import { states } from "config/states";
import format from "date-fns/format";

export default class AppStore {
  constructor(fetch) {
    this.fetch = fetch;
  }

  // logic----------------------------------------------------------------------
  @observable protocol = window.location.protocol;

  @computed
  get areRequiredFieldsSet() {
    return (
      Object.keys(this.subject).length !== 0 &&
      Object.keys(this.state).length !== 0 &&
      Object.keys(this.station).length !== 0
    );
  }

  @observable isVisible = true;
  @action setIsVisible = () => (this.isVisible = !this.isVisible);

  @observable isCollapsed = true;
  @action setIsCollapsed = d => (this.isCollapsed = !this.isCollapsed);

  @observable isLoading = false;
  @action setIsLoading = d => (this.isLoading = d);

  @observable
  isMap = JSON.parse(localStorage.getItem("state")) !== null ? false : true;
  @action setIsMap = d => (this.isMap = d);
  @action toggleIsMap = d => (this.isMap = !this.isMap);

  @observable isGraph = false;
  @action setIsGraph = d => (this.isGraph = !this.isGraph);

  @observable
  breakpoints = {
    xs: "(max-width: 767px)",
    su: "(min-width: 768px)",
    sm: "(min-width: 768px) and (max-width: 991px)",
    md: "(min-width: 992px) and (max-width: 1199px)",
    mu: "(min-width: 992px)",
    lg: "(min-width: 1200px)"
  };
  @observable isSidebarOpen;
  @action setIsSidebarOpen = d => (this.isSidebarOpen = d);
  @action toggleSidebar = () => (this.isSidebarOpen = !this.isSidebarOpen);

  // Subject--------------------------------------------------------------
  @observable
  subjects = [
    { name: "Blueberry Maggot", diseases: ["Blueberrie Maggot"], graph: true }
  ];

  @observable
  subject = JSON.parse(localStorage.getItem("berries")) || {
    name: "Blueberry Maggot",
    diseases: ["Blueberrie Maggot"],
    graph: true
  };

  @computed
  get isSubject() {
    return Object.keys(this.subject).length !== 0;
  }

  @action
  setSubject = d => {
    this.subject = this.subjects.find(subject => subject.name === d);
    localStorage.setItem(`berries`, JSON.stringify(this.subject));
  };

  // State----------------------------------------------------------------------
  @observable
  state = JSON.parse(localStorage.getItem("state")) || {
    postalCode: "ALL",
    lat: 42.5,
    lon: -75.7,
    zoom: 6,
    name: "All States"
  };

  @action
  setState = stateName => {
    localStorage.removeItem("state");
    this.station = {};
    this.state = states.find(state => state.name === stateName);
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  @action
  setStateFromEntireMap = d => {
    this.state = states.find(state => state.postalCode === d);
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  // Station--------------------------------------------------------------------
  @observable stations = [];

  @action setStations = d => (this.stations = d);

  @computed
  get stationsWithMatchedIcons() {
    return matchIconsToStations(this.protocol, this.stations, this.state);
  }

  @computed
  get getCurrentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }

  @observable station = JSON.parse(localStorage.getItem("station")) || {};

  @computed
  get getStation() {
    return this.station;
  }

  @action
  setStation = stationName => {
    localStorage.removeItem("station");
    this.station = this.stations.find(station => station.name === stationName);
    localStorage.setItem("station", JSON.stringify(this.station));
  };

  // Dates----------------------------------------------------------------------
  @observable currentYear = new Date().getFullYear().toString();

  @observable endDate = format(new Date("2017-06-13"), "YYYY-MM-DD");

  @action
  setEndDate = d => {
    this.endDate = format(d, "YYYY-MM-DD");
    // localStorage.setItem("endDate", JSON.stringify(this.endDate));
  };

  @computed
  get startDate() {
    return `${format(this.endDate, "YYYY")}-01-01`;
  }

  @computed
  get startDateYear() {
    return format(this.endDate, "YYYY");
  }

  // ACISData ------------------------------------------------------------------
  @observable ACISData = [];

  @action
  setACISData = d => {
    this.ACISData = d;
    this.setCSVData();
  };

  @computed
  get displayPlusButton() {
    return this.ACISData.filter(e => e.missingDay).length > 0;
  }

  @observable CSVData = [];

  @action
  setCSVData() {
    this.ACISData.forEach(obj => {
      const picked = (({ date, dd, cdd, Tmin, Tmax, Tavg, base }) => ({
        date,
        dd,
        cdd,
        Tmin,
        Tmax,
        Tavg,
        base
      }))(obj);
      this.CSVData.push(picked);
    });
  }

  @observable bmModel = [];

  @action
  loadBmModel() {
    this.isLoading = true;
    this.fetch("bmModel.json")
      .then(json => {
        this.updateBmModel(json);
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load blueberry Maggot Model", err);
      });
  }

  @action
  updateBmModel(json) {
    this.bmModel.clear();
    json.forEach(stage => {
      this.bmModel.push(stage);
    });
  }
}
