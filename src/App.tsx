import './App.css'
import AppShell from "./components/AppShell.tsx";
import Login from "./pages/Login.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import WorkoutsListPage from "./pages/workouts/WorkoutsListPage.tsx";
import AddEditExercisePage from "./pages/exercises/AddEditExercisePage.tsx"
import ExercisesListPage from "./pages/exercises/ExercisesListPage.tsx"
import ActiveWorkoutPage from "./pages/workouts/ActiveWorkoutPage.tsx"
import AddExerciseToWorkoutPage from "./pages/workouts/AddExerciseToWorkoutPage.tsx"
import WorkoutDetailPage from "./pages/workouts/WorkoutDetailPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ExerciseDetailPage from "./pages/exercises/ExerciseDetailPage.tsx";


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
                        <Route path={"/exercises/create"} element={<AddEditExercisePage />} />
                        <Route path={"/exercises"} element={<ExercisesListPage />} />
                        <Route path={"/workouts/new"} element={<ActiveWorkoutPage />} />
                        <Route path={"/workouts/:id/active"} element={<ActiveWorkoutPage />} />
                        <Route path={"/workouts/:id/add-exercise"} element={<AddExerciseToWorkoutPage />} />
                        <Route path={"/workouts/:id"} element={<WorkoutDetailPage />} />
                        <Route path={"/exercises/:id"} element={<ExerciseDetailPage />} />
                        <Route path={"/exercises/:id/edit"} element={<AddEditExercisePage />} />

                    </Route>
                </Routes>
            </Router>
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
    </AppShell>
  )
}

export default App
