import './App.css'
import AppShell from "./components/AppShell.tsx";
import Login from "./pages/Login.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import WorkoutsListPage from "./pages/WorkoutsListPage.tsx";
import AddExercisePage from "./pages/AddExercisePage.tsx"
import ExercisesListPage from "./pages/ExercisesListPage.tsx"
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage.tsx"
import AddExerciseToWorkoutPage from "./pages/AddExerciseToWorkoutPage.tsx"
import WorkoutDetailPage from "./pages/WorkoutDetailPage.tsx";


function App() {

  return (
    <AppShell>
        <Router>
            <Routes>
                <Route path={"/"} element={<Login />} />
                <Route path={"/dashboard"} element={<Dashboard />} />
                <Route path={"/workouts"} element={<WorkoutsListPage />} />
                <Route path={"/exercises/create"} element={<AddExercisePage />} />
                <Route path={"/exercises"} element={<ExercisesListPage />} />
                <Route path={"/workouts/new"} element={<ActiveWorkoutPage />} />
                <Route path={"/workouts/add-exercise"} element={<AddExerciseToWorkoutPage />} />
                <Route path={"/workouts/:id"} element={<WorkoutDetailPage />} />
            </Routes>
        </Router>
    </AppShell>
  )
}

export default App
