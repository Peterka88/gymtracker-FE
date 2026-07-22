import './App.css'
import AppShell from "./components/AppShell.tsx";
import Login from "./pages/Login.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import WorkoutsListPage from "./pages/workouts/WorkoutsListPage.tsx";
import AddExercisePage from "./pages/exercises/AddExercisePage.tsx"
import ExercisesListPage from "./pages/exercises/ExercisesListPage.tsx"
import ActiveWorkoutPage from "./pages/workouts/ActiveWorkoutPage.tsx"
import AddExerciseToWorkoutPage from "./pages/workouts/AddExerciseToWorkoutPage.tsx"
import WorkoutDetailPage from "./pages/workouts/WorkoutDetailPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { Analytics } from "@vercel/analytics/react";


function App() {

  return (
    <AppShell>
        <ToastProvider>
            <Router>
                <Routes>
                    <Route path={"/"} element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path={"/dashboard"} element={<Dashboard />} />
                        <Route path={"/workouts"} element={<WorkoutsListPage />} />
                        <Route path={"/exercises/create"} element={<AddExercisePage />} />
                        <Route path={"/exercises"} element={<ExercisesListPage />} />
                        <Route path={"/workouts/new"} element={<ActiveWorkoutPage />} />
                        <Route path={"/workouts/:id/active"} element={<ActiveWorkoutPage />} />
                        <Route path={"/workouts/:id/add-exercise"} element={<AddExerciseToWorkoutPage />} />
                        <Route path={"/workouts/:id"} element={<WorkoutDetailPage />} />
                    </Route>
                </Routes>
            </Router>
        </ToastProvider>
        <Analytics />
    </AppShell>
  )
}

export default App
