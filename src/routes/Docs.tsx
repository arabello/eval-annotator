import evalHarnessImg from "@/assets/eval-harness.png";
import { ArrowLeftIcon, DownloadIcon, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/download";
import { Link } from "react-router";
import JsonView from "@uiw/react-json-view";
import experimentSchema from "@/assets/experiment.schema.json";
import sampleExperiment from "@/assets/sample-experiment.json";

export default function Docs() {
  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center px-6 py-3 border-b bg-white">
        <div className="text-lg font-semibold flex-1">Docs</div>
        <div className="flex gap-3">
          <Link to="https://github.com/arabello/eval-annotator" target="_blank">
            <Button variant="outline" size="sm" asChild>
              <div>
                <GithubIcon />
                Github
              </div>
            </Button>
          </Link>
          <Link to="/">
            <Button size="sm" asChild>
              <div>
                <ArrowLeftIcon />
                Back
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-3xl space-y-4 px-3 py-5">
        {/* Overview */}
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p>
          Eval Annotator is an{" "}
          <a
            href="https://www.buildo.com/blog-posts/evaluation-driven-development"
            target="_blank"
            className="font-medium text-primary hover:underline"
          >
            Evaluation Driven Development
          </a>{" "}
          minimalistic tool for LLM conversational projects. It allows you to
          annotate candidate's responses (current changes) against the baseline
          (main) with respect to a Ground Truth dataset.
        </p>
        {/* Workflow */}
        <h1 className="text-3xl font-semibold">Workflow</h1>
        <p>
          A Ground Truth is a dataset of sampled conversations for the
          conversational AI software you are developing. Each entry contains the
          conversation messages and a baseline answer representing the current
          stable behavior. Additionally, entries can include expected and actual
          tool calls for evaluating function calling capabilities. An Experiment
          is an evaluation suite run (current changes) against the entries of
          the Ground Truth providing the candidate's responses. The Experiment
          goal is to evaluate if the changes are improving or worsening the
          software behavior overall.
        </p>
        <p>
          Eval Annotator helps you at Experiment evaluation time. It provides a
          simple interface to navigate through the dataset and annotate the
          responses. It is agnostic to the rest of the software and
          technologies: its interface is an Experiment JSON file that your
          evaluation suite should produce.
        </p>
        <img
          src={evalHarnessImg}
          alt="Eval Harness"
          className="max-w-full h-auto"
        />
        <p>
          The Experiment JSON file is the Eval Annotator state, allowing you to
          import/export the file and share it with colleagues to get their
          feedbacks.
        </p>
        {/* Tool Calls */}
        <h1 className="text-3xl font-semibold">Tool Calls Evaluation</h1>
        <p>
          For applications that use function calling, entries can include{" "}
          <code>expected_tool_calls</code> and <code>actual_tool_calls</code>{" "}
          fields to evaluate the accuracy of tool usage.
        </p>
        <p>
          <strong>expected_tool_calls</strong>: Array of tool calls that should
          have been made, each containing:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <code>name</code>: String - The name of the tool/function
          </li>
          <li>
            <code>arguments</code>: Object - The arguments that should have been
            passed to the tool
          </li>
        </ul>
        <p>
          <strong>actual_tool_calls</strong>: Array of tool calls that were
          actually made, with the same structure as expected calls.
        </p>

        {/* Experiment JSON */}
        <h1 className="text-3xl font-semibold">Experiment JSON</h1>
        <p>
          Below here the Experiment JSON schema and a sample JSON file. Import
          will validate the JSON file against the schema.
        </p>
        <p>
          <div className="flex justify-between items-center space-y-4">
            <h2 className="text-2xl">JSON Schema</h2>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() =>
                downloadFile(
                  "/assets/experiment.schema.json",
                  "experiment.schema.json",
                )
              }
            >
              <DownloadIcon />
            </Button>
          </div>
          <JsonView value={experimentSchema} collapsed />
        </p>
        <p>
          <div className="flex justify-between items-center space-y-4">
            <h2 className="text-2xl">Sample JSON</h2>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() =>
                downloadFile(
                  "/assets/sample-experiment.json",
                  "sample-experiment.json",
                )
              }
            >
              <DownloadIcon />
            </Button>
          </div>
          <JsonView value={sampleExperiment} collapsed />
        </p>

        {/* Contacts */}
        <p>
          <h1 className="text-3xl font-semibold">Contacts</h1>
          For any feedback, contribution or help request, please reach out to{" "}
          <Link
            to="mailto:matteo.pelle.pellegrino+eval-annotator@gmail.com"
            className="text-primary hover:underline"
          >
            matteo.pelle.pellegrino+eval-annotator (at) gmail (dot) com
          </Link>
        </p>
      </div>
    </div>
  );
}
