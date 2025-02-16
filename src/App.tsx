// src/App.tsx
import { SignInButton, SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Drive from "./Drive";
import Header from "./components/ui/Header";
import Hero from "./components/Hero";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Unauthenticated>
                    <div className="mt-8">
                      <h1 className="text-black dark:text-white font-bold text-center mb-3">
                        Login to get started
                      </h1>
                      <center>
                        <SignIn />
                      </center>
                    </div>
                  </Unauthenticated>
                  <Authenticated>
                    <Hero />
                  </Authenticated>
                </main>
              }
            />
            <Route
              path="/drive"
              element={
                <Authenticated>
                  <Drive />
                </Authenticated>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
