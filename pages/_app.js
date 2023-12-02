import store from "@/src/store";
import Modal from 'react-modal';
import { Provider } from "react-redux";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "@/styles/globals.scss";
Modal.setAppElement('#__next');
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
     <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
      </DndProvider>
    </Provider>
  );
}
