// src/App.tsx
import { SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Drive from "./Drive";
import Header from "./components/ui/Header";
import Hero from "./components/Hero";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col bg-gray-100">
          <Header />
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <main>
                    <Unauthenticated>
                      <div className="text-center mt-20">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800">
                          Login to get started
                        </h1>
                        <center>
                          <SignIn />
                        </center>
                      </div>
                    </Unauthenticated>
                    <Authenticated>
                      <h1 className="text-4xl font-bold text-gray-800">
                        <Hero />
                      </h1>
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
          <footer className="bg-white shadow p-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} Drive
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
