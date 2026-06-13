import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = [
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F59E0B",
];

export default function Analyze() {
  const [data, setData] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  const fetchAnalysis =
    async () => {
      try {
        const res =
          await fetch(
            "/api/analyze",
            {
              method: "POST",
            }
          );

        const json =
          await res.json();

        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Analyzing...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Failed to load.
      </div>
    );
  }

  const Metric = ({ title, value }) => (
  <div
    className="
    rounded-2xl
    border
    border-border
    bg-surface/70
    backdrop-blur-xl
    p-4
  "
  >
    <p className="text-[11px] uppercase tracking-widest text-text/50">
      {title}
    </p>

    <h3 className="mt-2 text-l font-bold">
      {value}
    </h3>
  </div>
);

  const Progress = ({
    label,
    value,
  }) => (
    <div>

      <div className="flex justify-between mb-2">

        <span>
          {label}
        </span>

        <span>
          {value}%
        </span>

      </div>

      <div className="h-3 rounded-full bg-bg">

        <div
          className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-purple-500
          to-pink-500
        "
          style={{
            width:
              `${value}%`,
          }}
        />

      </div>

    </div>
  );

  return (
    <div className="space-y-8">

      {/* SUMMARY */}

      <div className="grid md:grid-cols-4 gap-4">

        <Metric
          title="Spend"
          value={`$${data.summary.total_spend}`}
        />

        <Metric
          title="Spike"
          value={
            data.summary
              .biggest_spike
          }
        />

        <Metric
          title="Errors"
          value={
            data.summary
              .total_errors
          }
        />

        <Metric
          title="Savings"
          value={`$${data.summary.estimated_savings}`}
        />

      </div>

      {/* CHARTS */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="
            rounded-2xl
            border
            border-border
            bg-surface/70
            backdrop-blur-xl
            p-5">

          <h3 className="
            text-sm
            uppercase
            tracking-widest
            font-bold
            text-text-title/80
            mb-5
            ">
            Spend by Service
          </h3>

          <ResponsiveContainer
            width="100%"
            height={240}
          >

            <PieChart>

              <Pie
                data={
                  data.graphs
                    .spend_by_service
                }
                dataKey="total_cost"
                nameKey="service"
                outerRadius={90}
              >

                {data.graphs.spend_by_service.map(
                  (
                    _,
                    i
                  ) => (
                    <Cell
                      key={i}
                      fill={
                        COLORS[
                          i %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="rounded-3xl p-6 bg-bg/20 border border-border">

          <h3 className="font-bold mb-5">
            Errors
          </h3>

          <ResponsiveContainer
            width="100%"
            height={240}
          >

            <LineChart
              data={
                data.graphs
                  .errors_over_time
              }
            >

              <XAxis
                dataKey="timestamp"
              />

              <YAxis />

              <Tooltip />

              <Line
                dataKey="error_count"
                stroke="#8B5CF6"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* FINDINGS */}

      <div className="space-y-4">

        <h3 className="font-bold">

          Findings

        </h3>

        {data.findings.map(
          (
            f,
            i
          ) => (
            <div
              key={i}
              className="
              rounded-2xl
              border
              border-border
              p-5
              bg-bg/20
            "
            >

              <div className="flex justify-between">

                <div>

                  <div className="font-bold">
                    {
                      f.resource
                    }
                  </div>

                  <div className="text-sm opacity-70">

                    {
                      f.detail
                    }

                  </div>

                </div>

                <div
                  className={`px-3 py-1 text-sm font-semibold ${getSeverityColor(f.severity)}`}
                >

                  {
                    f.severity
                  }

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* HEALTH */}

      <div className="rounded-3xl p-6 border border-border">

        <h3 className="font-bold mb-6">
          Health Score
        </h3>

        <div className="space-y-5">

          <Progress
            label="Overall"
            value={
              data
                .health_score
                .overall
            }
          />

          <Progress
            label="Cost"
            value={
              data
                .health_score
                .cost_efficiency
            }
          />

          <Progress
            label="Reliability"
            value={
              data
                .health_score
                .reliability
            }
          />

        </div>

      </div>

      {/* AGENT */}

      {/* AI SUMMARY */}

<section className="mb-8">

  <div
    className="
    rounded-3xl
    p-6
    bg-gradient-to-r
    from-purple-600/10
    to-cyan-600/10
    border
    border-border
    backdrop-blur-md
  "
  >

    <div
      className="
      mb-4
      text-xs
      uppercase
      tracking-widest
      text-purple-400
      font-bold
    "
    >
      AI Generated Summary
    </div>

    <div
      className="
      text-sm
      leading-8
      text-text-title/90
      whitespace-pre-line
    "
    >
      {data.agent_summary}
    </div>

  </div>

</section>

    </div>
  );
}