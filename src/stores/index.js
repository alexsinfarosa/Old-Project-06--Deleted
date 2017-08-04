import AppStore from "./app-store";
// import BeetStore from "../../src/models/Beets/beet-store";
// import BerryStore from "../../src/models/Berries/berry-store";
const fetcher = url => window.fetch(url).then(response => response.json());

const store = {
  app: new AppStore(fetcher)
  // beet: new BeetStore(),
  // berry: new BerryStore()
};

export default store;

store.app.loadBmModel();
