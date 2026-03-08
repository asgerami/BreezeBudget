import { useState } from "react";
import { AirVent, Calculator, Info } from "lucide-react";
import LandingPage from "./components/LandingPage";
import MultiStepWizard from "./components/MultiStepWizard";
import InteractiveSliders from "./components/InteractiveSliders";
import UnitComparison from "./components/UnitComparison";
import CostHeatMap from "./components/CostHeatMap";
import CostDisplay from "./components/CostDisplay";
import CostChart from "./components/CostChart";
import { CalculationInputs, CostCalculation, WeatherData } from "./types";
import { fetchWeatherData } from "./utils/api";
import { calculateCosts, saveCostCalculation } from "./utils/calculations";
import { generatePDFReport } from "./utils/pdfGenerator";

// main app component
// TODO: add error boundary wrapper
// TODO: add loading states for better UX
function App() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    zipCode: "",
    squareFootage: 2000,
    thermostatTemp: 75,
    seer2Rating: 16,
    insulationQuality: "average",
    selectedUnit: null,
    operatingHours: 8,
  });

  const [calculation, setCalculation] = useState<CostCalculation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [realTimeCosts, setRealTimeCosts] = useState<{
    dailyCost: number;
    monthlyCost: number;
    annualCost: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleCalculate = async () => {
    if (!inputs.zipCode || !inputs.selectedUnit) {
      setError("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);
    setError("");

    try {
      // Fetch weather data
      const weather = await fetchWeatherData(inputs.zipCode);
      setWeatherData(weather);

      // Calculate costs
      const results = await calculateCosts(inputs, weather);

      // Create calculation object
      const newCalculation: CostCalculation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        inputs: { ...inputs },
        results,
        weatherData: weather,
      };

      setCalculation(newCalculation);
      saveCostCalculation(newCalculation);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Invalid ZIP code") {
          setError(
            "Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)"
          );
        } else if (err.message === "Failed to fetch weather data") {
          setError(
            "Unable to retrieve weather data. Please check your internet connection and try again."
          );
        } else {
          setError("Failed to calculate costs. Please try again.");
        }
      } else {
        setError("Failed to calculate costs. Please try again.");
      }
      console.error("Calculation error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRealTimeUpdate = async (newInputs: CalculationInputs) => {
    if (!weatherData || !newInputs.selectedUnit) return;

    try {
      const results = await calculateCosts(newInputs, weatherData);
      setRealTimeCosts({
        dailyCost: results.dailyCost,
        monthlyCost: results.monthlyCost,
        annualCost: results.annualCost,
      });
    } catch (error) {
      console.error("Real-time calculation error:", error);
    }
  };

  const handleStartAnalysis = () => {
    // Reset all state for a fresh analysis
    setInputs({
      zipCode: "",
      squareFootage: 2000,
      thermostatTemp: 75,
      seer2Rating: 16,
      insulationQuality: "average",
      selectedUnit: null,
      operatingHours: 8,
    });
    setCalculation(null);
    setWeatherData(null);
    setRealTimeCosts(null);
    setError("");
    setShowWizard(true);
  };

  const handleDownloadPDF = async () => {
    if (!calculation) return;

    setIsGeneratingPDF(true);
    try {
      await generatePDFReport(calculation);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!showWizard) {
    return <LandingPage onStartAnalysis={handleStartAnalysis} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* PDF Download - Fixed */}
      {calculation && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${isGeneratingPDF
                ? "bg-stone-400 cursor-not-allowed"
                : "bg-accent hover:bg-accent-hover"
              }`}
            title="Download your results as PDF"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span className="text-sm">Generating…</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Download PDF</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Header - compact, clear separation */}
      <header className="bg-surface-elevated border-b border-stone-200 h-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowWizard(false)}
              className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
            >
              <div className="p-1.5 bg-accent rounded-lg text-white">
                <AirVent className="w-5 h-5" aria-hidden />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-[var(--color-ink)]">
                  Breeze-Budget
                </h1>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Cooling cost analysis
                </p>
              </div>
            </button>
            <span className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <Calculator className="w-4 h-4" aria-hidden />
              Smart energy analysis
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}

        {/* Error - semantic red, icon + message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3" role="alert">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-xs font-bold" aria-hidden>!</span>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        <MultiStepWizard
          inputs={inputs}
          onInputChange={setInputs}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />

        {/* Results */}
        {calculation && weatherData && (
          <div className="space-y-6">
            <CostDisplay calculation={calculation} />
            <CostChart inputs={inputs} weatherData={weatherData} />
            <UnitComparison inputs={inputs} weatherData={weatherData} />
            <InteractiveSliders
              inputs={inputs}
              onInputChange={setInputs}
              onRealTimeUpdate={handleRealTimeUpdate}
              realTimeCosts={realTimeCosts}
            />
            <CostHeatMap inputs={inputs} weatherData={weatherData} />
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-stone-200 text-center text-sm text-[var(--color-ink-muted)]">
          <p>Weather data: Open-Meteo. Location: ZippopotamUS.</p>
          <p className="mt-1 font-medium text-[var(--color-ink)]">Breeze-Budget &copy; {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
