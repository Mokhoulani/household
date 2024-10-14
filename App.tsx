import { Provider } from 'react-redux';
import MainApp from './main/MainApp';
import { store } from './store/store'; // Redux store

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
