import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { useState } from "react";
import Analytics from "./components/Analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Loading from "./components/Loading";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  // src/app.jsx
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <Loading /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics/:videoId" element={<Analytics />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
