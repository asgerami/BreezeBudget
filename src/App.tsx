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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* PDF Download Button - Fixed Position */}
      {calculation && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white shadow-lg transition-all duration-200 ${
              isGeneratingPDF
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            title="Download your results as PDF"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm">Download PDF</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setShowWizard(false)}
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <AirVent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Breeze-Budget
                </h1>
                <p className="text-sm text-gray-600">
                  Smarter Home Cooling Cost Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calculator className="w-4 h-4" />
              <span>Smart Energy Analysis</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">How It Works</h3>
              <p className="text-blue-800 text-sm mt-1">
                Enter your home details and select an AC unit to get accurate
                cost projections based on real weather data, energy efficiency
                ratings, and local conditions. Our calculator factors in
                seasonal variations, insulation quality, and operating patterns
                to provide comprehensive cost analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
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

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <div className="border-t border-gray-200 pt-8">
            <p>
              Cost calculations are estimates based on average electricity rates
              and typical usage patterns. Actual costs may vary based on local
              utility rates, weather conditions, and individual usage habits.
            </p>
            <p className="mt-2">
              Weather data provided by Open-Meteo API. Location data from
              ZippopotamUS.
            </p>
            <p className="mt-2 font-semibold">
              Breeze-Budget &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
