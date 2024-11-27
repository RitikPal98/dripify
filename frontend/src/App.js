import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CollabGenerator from "./pages/CollabGenerator";
import Gallery from "./pages/Gallery";
import { CollabProvider } from "./context/CollabContext";
import { Toaster } from "react-hot-toast";

// Create a custom theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "rgba(255, 255, 255, 0.85)",
        color: "gray.800",
        bgImage: "https://www.transparenttextures.com/patterns/skulls.png",
      },
    },
  },
  colors: {
    brand: {
      50: "#f0e4ff",
      100: "#cbb2ff",
      200: "#a480ff",
      300: "#7c4dff",
      400: "#541aff",
      500: "#3b00e6",
      600: "#2e00b4",
      700: "#210082",
      800: "#140050",
      900: "#07001f",
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CollabProvider>
        <Router>
          <div
            className="App"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Toaster position="top-center" />
            <Header />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<CollabGenerator />} />
                <Route path="/gallery" element={<Gallery />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CollabProvider>
    </ChakraProvider>
  );
}

export default App;
