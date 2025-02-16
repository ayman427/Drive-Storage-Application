// src/App.tsx
import { SignInButton } from "@clerk/clerk-react";
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
                    <div>
                      <h1 className="text-black dark:text-white">
                        Login to get started
                      </h1>
                      <center>
                        <SignInButton />
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
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center">
          &copy; {new Date().getFullYear()} Drive
        </footer>
      </div>
    </Router>
  );
}

export default App;
