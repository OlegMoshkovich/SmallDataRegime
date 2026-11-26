"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Piece = {
  id: string;
  label: string;
  note: string;
};

type Beat = {
  id: string;
  at: number;
  system: string;
  text: string;
};

type Setup = {
  overview: string;
  time: string;
  departments: string;
  handoff: string;
};

type Route = {
  access: Piece[];
  control: Piece[];
  compute: Piece[];
  storage: Piece[];
  story: Beat[];
  reply: string;
  setup?: Setup;
};

type Message = {
  id: number;
  role: "person" | "platform";
  text: string;
};

const samples: { label: string; query: string; route: Route }[] = [
  {
    label: "Fraud and AML",
    query: "Score this card payment and triage the alert.",
    route: {
      access: [
        {
          id: "engineers",
          label: "Data engineers",
          note: "Card and transfer events have to keep moving. That pipeline belongs to the engineers, so they are the ones who build it.",
        },
        {
          id: "ai-apps",
          label: "AI apps and agents",
          note: "The score is needed at the moment of the payment. The app or the agent is already there, so the call starts from them.",
        },
      ],
      control: [
        {
          id: "jobs",
          label: "Notebooks and jobs",
          note: "The stream is production code that starts, runs, and stops. A job is how that code stays on a schedule.",
        },
        {
          id: "gateway",
          label: "Agents and AI Gateway",
          note: "The live score is a model call. AI Gateway is in front of it so the caller, the cost, and the limit are recorded.",
        },
      ],
      compute: [
        {
          id: "spark",
          label: "Spark clusters",
          note: "The events arrive as a stream and have to be written into Delta. Spark is the engine that keeps that write going.",
        },
        {
          id: "serving",
          label: "Model serving",
          note: "One payment needs one score, at the speed of the transaction. Model serving answers that single request and scales with the traffic.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "The events and the scores have to remain for a later review. Delta keeps both, so a later report reads the same tables.",
        },
        {
          id: "models",
          label: "Models",
          note: "Serving has to load the approved score model, with its signature. The registry is where that version is kept.",
        },
      ],
      story: [
        {
          id: "notebooks",
          at: 1,
          system: "Notebooks",
          text: "The engineers' notebooks are opened. The streaming job is already saved there. The notebook stays where it is. It is used only to start the job.",
        },
        {
          id: "app",
          at: 1,
          system: "Payment app",
          text: "The payment app opens at the moment of the payment and asks for a score. It does not pull the customer's history onto the device.",
        },
        {
          id: "job",
          at: 2,
          system: "Streaming job",
          text: "The job opens and reads new card and transfer events. It writes the events it consumed. When the batch is done, the job stops. The events remain.",
        },
        {
          id: "gateway",
          at: 2,
          system: "AI Gateway",
          text: "The gateway opens for the score call. It writes a log of who called and enforces the limit. It does not keep the payment.",
        },
        {
          id: "spark",
          at: 3,
          system: "Spark",
          text: "Spark opens the stream, writes the rows into a table, and can shut down afterward. The rows stay in the table.",
        },
        {
          id: "serving",
          at: 3,
          system: "Model serving",
          text: "The scoring endpoint opens, loads the current fraud model, and returns a score. It does not store the payment after the answer.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta tables",
          text: "The events table is opened and the new rows are added. Older rows are left as they were, so a later report can read the same table.",
        },
        {
          id: "registry",
          at: 4,
          system: "Model registry",
          text: "The registry is opened so serving can read the approved model. This payment does not change the model.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog is checked as each system opens. It allows the job, the table, the model, and the endpoint, and it records that path. It does not hold the payment.",
        },
      ],
      reply:
        "Fraud and AML uses the engineer path and the agent path. Notebooks and jobs run Lakeflow on Spark, which writes card and transfer events to Delta tables. Model serving loads the MLflow model and answers the app. AI Gateway records the call. Unity Catalog checks the table, the model, and the endpoint.",
      setup: {
        overview:
          "Two departments share this run. **Payments engineering** keeps the card and transfer events moving. **Fraud operations** scores the payment and triages the alert. The stream and the score run on their own once the pipeline is in place.",
        time:
          "The stream stays on through the day. A score comes back in under a second, at the speed of the card payment. The event and the score are in the table within that same minute. A fraud analyst opens the alert later the same day.",
        departments:
          "Payments engineering owns the notebooks and the streaming job. They write the events into Delta and keep the approved model in the registry. Fraud operations is on the payment app. The app asks for the score, and an analyst triages the alert from the event and the score.",
        handoff:
          "The handoff is the score and the event row. The app calls model serving, and AI Gateway logs who called and the limit. Spark has written the card event into Delta. Fraud operations reads that row and the score. Unity Catalog allows the job, the table, the model, and the endpoint for both sides.",
      },
    },
  },
  {
    label: "Credit risk",
    query: "Run the expected-loss stress test.",
    route: {
      access: [
        {
          id: "engineers",
          label: "Data engineers",
          note: "The scorecard is trained and refreshed from features the engineers own. They start this path.",
        },
        {
          id: "analysts",
          label: "Analysts and BI tools",
          note: "The stress test is a report on tables that are already built. Analysts are the people who read it.",
        },
      ],
      control: [
        {
          id: "jobs",
          label: "Notebooks and jobs",
          note: "Training has to be repeatable, and it has to write the features it used. A job does both.",
        },
        {
          id: "genie",
          label: "Genie and AI/BI",
          note: "The stress pack is a dashboard over a certified metric. Genie and AI/BI are how analysts open that pack.",
        },
      ],
      compute: [
        {
          id: "spark",
          label: "Spark clusters",
          note: "Building the features and fitting the scorecard is a heavy batch job. Spark is the engine for that work.",
        },
        {
          id: "warehouse",
          label: "SQL warehouse",
          note: "The report is SQL over gold tables that training already wrote. The warehouse is the engine for that read.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "Exposures, features, and results have to stay as a version the report can reopen. Delta holds that version.",
        },
        {
          id: "models",
          label: "Models",
          note: "The report has to name the scorecard it used. The registry keeps that version next to the tables it read.",
        },
      ],
      story: [
        {
          id: "notebooks",
          at: 1,
          system: "Notebooks",
          text: "The engineers' notebooks are opened and the training job is started from them. The notebook itself is not copied out.",
        },
        {
          id: "analysts",
          at: 1,
          system: "Analyst tools",
          text: "The analyst's dashboard is opened to read the finished stress numbers. It does not retrain the model.",
        },
        {
          id: "job",
          at: 2,
          system: "Training job",
          text: "The job opens the exposure tables, fits the scorecard, and writes the features it used. Then the job stops.",
        },
        {
          id: "dashboard",
          at: 2,
          system: "Dashboard",
          text: "The stress pack opens on the finished tables. It reads. It does not write a new model.",
        },
        {
          id: "spark",
          at: 3,
          system: "Spark",
          text: "Spark opens the feature tables, writes the results, and shuts down. The results stay.",
        },
        {
          id: "warehouse",
          at: 3,
          system: "SQL warehouse",
          text: "The warehouse opens the finished tables and runs the stress query. It does not change the rows.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta tables",
          text: "The results table is opened and a new version is written. The previous version is kept, so the report can still point at the one it used.",
        },
        {
          id: "registry",
          at: 4,
          system: "Model registry",
          text: "The registry is opened and the scorecard is saved there, with the names of the tables it read.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog records the line from those tables to the model to the report. That line is the audit.",
        },
      ],
      reply:
        "Credit risk trains, then reports. Engineers run the scorecard as a job on Spark and register it under Models. Inputs and results are Delta tables. Analysts read the stress numbers through Genie and the SQL warehouse, from those same tables. Unity Catalog lineage is the audit from table to model to report.",
      setup: {
        overview:
          "Two departments share this run. **Credit-risk engineering** trains the scorecard and writes the results. **Credit-risk reporting** reads the stress pack from those same tables. The job in the middle runs on its own once engineering starts it.",
        time:
          "The job is set to run overnight. Building the features and fitting the scorecard takes about three hours on Spark. The tables are ready at the start of the business day. Opening the stress pack and reading the numbers takes a few minutes.",
        departments:
          "Credit-risk engineering opens the notebooks and starts the training job. They own the features, the results table, and the registered scorecard. Credit-risk reporting opens the dashboard and Genie the same morning. They read the finished numbers. The model stays as engineering left it.",
        handoff:
          "The handoff is the table. The job writes a new version of the results and registers the scorecard under Models. Reporting opens that version through the certified metric, in Genie and the SQL warehouse. Unity Catalog names the tables, the model, and the report, so both departments read the same record.",
      },
    },
  },
  {
    label: "Customer 360",
    query: "Build a customer's profile and offer the next product.",
    route: {
      access: [
        {
          id: "engineers",
          label: "Data engineers",
          note: "The customer is one row. Their products and channels have to be joined into one profile, and that pipeline belongs to the engineers.",
        },
        {
          id: "apps",
          label: "Business apps",
          note: "The offer is shown on the customer's screen. The business app reads that one live row.",
        },
      ],
      control: [
        {
          id: "jobs",
          label: "Notebooks and jobs",
          note: "Lakeflow rebuilds the customer's profile on a schedule and writes it to Delta Lake. A job is how that rebuild stays repeatable.",
        },
        {
          id: "apps",
          label: "Databricks Apps",
          note: "The offer screen is an app on the platform, so it keeps the signed-in user's Unity Catalog grants.",
        },
      ],
      compute: [
        {
          id: "spark",
          label: "Spark clusters",
          note: "The profile is a join across the customer's products and channels. Spark is the engine Lakeflow uses to build that row.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "Delta Lake holds the customer's identity, the joined profile, and its history. Databricks SQL and Genie read that same row.",
        },
        {
          id: "lakebase",
          label: "Lakebase Postgres",
          note: "Lakebase holds the live row the app reads, and the offer the app writes back. That write syncs into Delta Lake.",
        },
      ],
      story: [
        {
          id: "notebooks",
          at: 1,
          system: "Notebooks",
          text: "The engineers' notebooks open and start the Lakeflow job that joins the customer's products and channels into one profile.",
        },
        {
          id: "app",
          at: 1,
          system: "Offer app",
          text: "The offer screen opens and asks for the customer. It reads the live row in Lakebase.",
        },
        {
          id: "job",
          at: 2,
          system: "Profile job",
          text: "The job opens the customer's source tables in Delta Lake, writes one profile row, and stops. The sources stay where they are.",
        },
        {
          id: "screen",
          at: 2,
          system: "App screen",
          text: "The screen opens on Databricks Apps. Unity Catalog allows only this customer's profile.",
        },
        {
          id: "spark",
          at: 3,
          system: "Spark",
          text: "Spark opens the customer's tables, writes the joined profile to Delta Lake, and can shut down. The row remains.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Lakebase",
          text: "Lakebase opens the live row. The app reads it and writes the offer. That row is what the screen shows.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta Lake",
          text: "The profile table opens and the joined row is written there. Databricks SQL and Genie can read that same row.",
        },
        {
          id: "sync",
          at: 4,
          system: "Sync",
          text: "The sync copies the offer from Lakebase into the customer's Delta Lake profile. The app and the next job then read one row.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "Unity Catalog allows the job, the app, and both copies, and records who opened the customer's record.",
        },
      ],
      reply:
        "The customer is one row. Lakeflow runs on Spark and writes the joined profile to Delta Lake, where Databricks SQL and Genie can read it. The app reads the live row from Lakebase and writes the offer there. That write syncs back into Delta Lake. Unity Catalog registers both copies and records who opened the record.",
      setup: {
        overview:
          "Two departments share this run. **Customer data engineering** rebuilds the customer's profile from their products and channels. The **digital product team** shows the next offer on the app. The rebuild runs on a schedule. The offer is written when the customer is on the screen.",
        time:
          "The profile job runs overnight and finishes in about an hour. By morning the joined row is in Delta Lake and synced to the live row. The offer appears in the same session the customer opens the app. The offer the customer takes is written then and copied back into Delta for the next rebuild.",
        departments:
          "Customer data engineering opens the notebooks and starts the Lakeflow job. They own the joined profile. The digital product team owns the offer screen on Databricks Apps. The signed-in user of that app sees only that customer's row.",
        handoff:
          "The handoff is the customer's one row, kept in two places. Engineering writes the joined profile to Delta Lake, and that row is what Lakebase serves to the app. The app writes the offer into Lakebase. The sync copies that offer back into the Delta profile. Unity Catalog records who opened the record.",
      },
    },
  },
  {
    label: "Regulatory reporting",
    query: "Produce this period's regulatory report.",
    route: {
      access: [
        {
          id: "engineers",
          label: "Data engineers",
          note: "The report tables are rebuilt every period by a pipeline. The engineers own that pipeline, so they start it.",
        },
        {
          id: "analysts",
          label: "Analysts and BI tools",
          note: "The published pack is what analysts open. The numbers are already in tables, so they read them.",
        },
      ],
      control: [
        {
          id: "jobs",
          label: "Notebooks and jobs",
          note: "The period has to be rebuilt the same way each time. A job does that, and a failed run leaves the previous version in place.",
        },
        {
          id: "genie",
          label: "Genie and AI/BI",
          note: "The pack is a dashboard on one certified metric. Genie is how a follow-up question uses that same metric.",
        },
      ],
      compute: [
        {
          id: "spark",
          label: "Spark clusters",
          note: "Rebuilding the period's tables is a batch job over many sources. Spark is the engine for that rebuild.",
        },
        {
          id: "warehouse",
          label: "SQL warehouse",
          note: "The published report is a SQL read of the tables Spark wrote. The warehouse is the engine for that read.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "The report needs gold tables whose lineage points back at the sources. Delta is where that version is kept.",
        },
      ],
      story: [
        {
          id: "notebooks",
          at: 1,
          system: "Notebooks",
          text: "The engineers' notebooks are opened and start the pipeline that rebuilds the report. The notebook stays put.",
        },
        {
          id: "analysts",
          at: 1,
          system: "Analyst tools",
          text: "The analyst's pack is opened to read the numbers. It does not rebuild them.",
        },
        {
          id: "job",
          at: 2,
          system: "Report pipeline",
          text: "The pipeline opens the source tables and writes the report tables. If it fails, the previous tables stay.",
        },
        {
          id: "dashboard",
          at: 2,
          system: "Dashboard and Genie",
          text: "The pack opens, and a follow-up question opens Genie on the same metric. Both read. Neither makes a second copy.",
        },
        {
          id: "spark",
          at: 3,
          system: "Spark",
          text: "Spark opens the sources, writes the report tables, and shuts down. The tables remain.",
        },
        {
          id: "warehouse",
          at: 3,
          system: "SQL warehouse",
          text: "The warehouse opens those tables and runs the report query. It does not scan the raw files itself.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta tables",
          text: "The report tables are opened for the new period. A pointer is kept back to the sources they were built from.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog stores that line from source to figure. That is the record an auditor reads.",
        },
      ],
      reply:
        "Regulatory reporting goes in through the engineers and out through the analysts. Lakeflow runs on Spark and lands Delta tables. Databricks SQL and the dashboards read those tables through the warehouse. Unity Catalog lineage is the line from source to figure. Genie can ask a question of the same metric without a second copy.",
      setup: {
        overview:
          "Two departments share this run. **Finance engineering** rebuilds the period's report tables. **Regulatory reporting** reads the published pack. The pipeline runs on its own once engineering starts it. A failed run leaves the previous period in place.",
        time:
          "The pipeline starts after the period closes and runs overnight. Rebuilding the tables takes about four hours on Spark. The pack is ready at the start of the next business day. A follow-up question in Genie comes back in about a minute.",
        departments:
          "Finance engineering opens the notebooks and starts the report pipeline. They own the rebuild from source to table. Regulatory reporting opens the pack and asks the follow-up. An auditor reads the lineage from those same tables.",
        handoff:
          "The handoff is the period's tables. The pipeline writes a new version and keeps a pointer back to the sources. Reporting opens that version in the dashboard and in Genie, on one certified metric. Unity Catalog stores the line from source to figure, which is the record the auditor reads.",
      },
    },
  },
  {
    label: "Questions on data",
    query: "What is our NPS?",
    route: {
      access: [
        {
          id: "analysts",
          label: "Analysts and BI tools",
          note: "This is a question on a number that already exists. An analyst asks it, so the path starts with them.",
        },
      ],
      control: [
        {
          id: "genie",
          label: "Genie and AI/BI",
          note: "The question should become SQL against the certified NPS metric. Genie is the place that holds that definition.",
        },
      ],
      compute: [
        {
          id: "warehouse",
          label: "SQL warehouse",
          note: "One SQL question needs an engine that can scale up for the query and back down after. That engine is the warehouse.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "The metric already points at a gold table. Delta is that table, and the warehouse reads it where it sits.",
        },
      ],
      story: [
        {
          id: "analysts",
          at: 1,
          system: "Analyst tools",
          text: "The analyst's workspace is opened. No job is started and no file is copied.",
        },
        {
          id: "genie",
          at: 2,
          system: "Genie",
          text: "Genie opens the question and turns it into SQL against the saved definition of the metric. The definition is read, not changed.",
        },
        {
          id: "warehouse",
          at: 3,
          system: "SQL warehouse",
          text: "The warehouse opens the table behind that definition, runs the query, and scales back down. The table is unchanged.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta tables",
          text: "The gold table is opened for reading. No rows are added or changed.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog checks the person and the table before the query runs. The model is not opened.",
        },
      ],
      reply:
        "Questions on data stay on the analyst path. Genie turns the plain question into SQL and sends it to the SQL warehouse. The warehouse reads the gold Delta table behind the metric view. Unity Catalog checks the person and the table before the query runs. Nothing is copied, and no model is called.",
      setup: {
        overview:
          "One department does this run. **Customer insight** asks a question on a number that already exists. Genie turns the question into SQL and the warehouse reads the gold table. No other team is called for this question.",
        time:
          "The answer comes back in a few seconds. If the warehouse has to scale up for the query, it can take about a minute, then it scales back down. The table is left as it was.",
        departments:
          "Customer insight asks the question. They open Genie and read NPS from the certified metric. Data engineering published that metric and the gold table earlier. They are not in this run.",
        handoff:
          "The handoff already happened, when the metric was certified. Genie reads that saved definition and sends SQL to the warehouse. The warehouse reads the gold table behind it. Unity Catalog checks the person and the table before the query runs. The definition and the table stay as they were.",
      },
    },
  },
  {
    label: "Documents",
    query: "Which policy passages apply to this vendor?",
    route: {
      access: [
        {
          id: "ai-apps",
          label: "AI apps and agents",
          note: "A person asks which passages apply. An agent is the access point, because the answer comes from a search and a model.",
        },
      ],
      control: [
        {
          id: "gateway",
          label: "Agents and AI Gateway",
          note: "The agent has to retrieve passages and call a model. AI Gateway sits on that call so the caller, the cost, and the limit are recorded.",
        },
      ],
      compute: [
        {
          id: "serving",
          label: "Model serving",
          note: "The answer is one model request, with the index searched beside it. Model serving is the endpoint that returns it.",
        },
      ],
      storage: [
        {
          id: "models",
          label: "Models",
          note: "The vector index and the model version live together. Serving loads that version, and the passages stay the documents that were embedded.",
        },
      ],
      story: [
        {
          id: "agent",
          at: 1,
          system: "Agent app",
          text: "The agent app is opened with the vendor question. The vendor file stays where it already lives.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Agent and AI Gateway",
          text: "The agent opens the policy index and asks the model a question. The gateway opens on that call, writes a log, and applies the limit. It does not keep the document.",
        },
        {
          id: "serving",
          at: 3,
          system: "Model serving",
          text: "The model endpoint opens, loads the model, and returns an answer. It does not keep the vendor file after the answer.",
        },
        {
          id: "index",
          at: 4,
          system: "Document index",
          text: "The index is opened next to the stored models. The passages that come back are the documents that were already embedded. Nothing new is filed as a record of the vendor.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog allows the index and the endpoint. It records the call. It does not become the system of record.",
        },
      ],
      reply:
        "Documents follow the agent path. Agent Bricks searches the vector index stored with Models, then calls the model through AI Gateway. Model serving loads that model. Unity Catalog governs the index and the endpoint. The answer cites passages. It does not write a system of record.",
      setup: {
        overview:
          "Two departments share this run. **Vendor management** asks which policy passages apply. The agent answers from the policy index and a model. **Platform engineering** keeps the index and the model. They are not on this call.",
        time:
          "The answer comes back in a few seconds. The policies were embedded earlier, when the index was built. This question leaves that index as it is. AI Gateway logs the call as it happens.",
        departments:
          "Vendor management, or compliance, asks in the agent app. The agent searches the passages and calls the model. Platform engineering owns the index, the model version, and the endpoint. The person asking reads the answer in the app.",
        handoff:
          "The handoff is the cited passages. The person asks in the app. The agent opens the policy index and the model through AI Gateway, which writes who called, the cost, and the limit. The answer quotes the passages that were already embedded. Unity Catalog allows the index and the endpoint and records the call. The vendor file stays where it already lives.",
      },
    },
  },
  {
    label: "Payments data",
    query: "Show merchant risk, and share it with the partner.",
    route: {
      access: [
        {
          id: "analysts",
          label: "Analysts and BI tools",
          note: "Merchant risk is a question on tables the analysts already use. They are the ones who ask it.",
        },
      ],
      control: [
        {
          id: "genie",
          label: "Genie and AI/BI",
          note: "The internal view is a dashboard, and the partner share is a catalog grant on the same table. Genie is where that question is asked.",
        },
      ],
      compute: [
        {
          id: "warehouse",
          label: "SQL warehouse",
          note: "The internal numbers are SQL on the payments tables. The warehouse is the engine that answers them.",
        },
      ],
      storage: [
        {
          id: "delta",
          label: "Delta tables",
          note: "One table holds the history. A share on that Delta table lets the partner read it where it sits, so the warehouse and the partner see the same copy.",
        },
      ],
      story: [
        {
          id: "analysts",
          at: 1,
          system: "Analyst tools",
          text: "The analyst's dashboard is opened for the internal risk numbers. The partner is not given a login to that dashboard.",
        },
        {
          id: "genie",
          at: 2,
          system: "Genie",
          text: "Genie opens the question and sends SQL. The partner share is a permission, not a second pipeline.",
        },
        {
          id: "warehouse",
          at: 3,
          system: "SQL warehouse",
          text: "The warehouse opens the payments table and answers the internal question. It does not make a copy for the partner.",
        },
        {
          id: "delta",
          at: 4,
          system: "Delta tables",
          text: "The payments table is opened. A share is granted on that same table. The partner reads it where it sits. No copy is made.",
        },
        {
          id: "catalog",
          at: 4,
          system: "Unity Catalog",
          text: "The catalog is where that grant is written. The warehouse and the partner then see one version of the table.",
        },
      ],
      reply:
        "Payments data is one Delta table with two readers. Analysts reach it through Genie and the SQL warehouse. Delta Sharing, granted in Unity Catalog, lets the partner read that same table without a copy. The warehouse and the share see one version.",
      setup: {
        overview:
          "**Payments analytics** and an **outside partner** read one table. Analytics asks for merchant risk inside the bank. The partner reads the same table through a share. No second pipeline is built for the partner.",
        time:
          "The internal numbers come back in a few seconds, or about a minute if the warehouse scales up. The share is granted once. The partner can read as soon as that grant is written. There is no overnight copy.",
        departments:
          "Payments analytics opens the dashboard and asks the question in Genie. They see the internal risk numbers. A catalog owner in data governance writes the partner grant. The partner is a separate firm, and they are not given a login to the dashboard.",
        handoff:
          "The handoff is a permission on the payments table. Analysts read it through Genie and the SQL warehouse. Delta Sharing, granted in Unity Catalog, lets the partner read that same table where it sits. The warehouse and the partner see one version.",
      },
    },
  },
];

function FlowDiagram({ route, step }: { route: Route | null; step: number }) {
  const waiting = (id: string): Piece => ({ id, label: "Waiting", note: "" });
  const layers: {
    id: string;
    title: string;
    accent?: boolean;
    items: Piece[];
  }[] = [
    {
      id: "access",
      title: "Access",
      items: route && step >= 1 ? route.access : [waiting("access")],
    },
    {
      id: "control",
      title: "Control",
      items: route && step >= 2 ? route.control : [waiting("control")],
    },
    {
      id: "compute",
      title: "Compute",
      accent: Boolean(route && step >= 3),
      items: route && step >= 3 ? route.compute : [waiting("compute")],
    },
    {
      id: "storage",
      title: "Storage",
      items: route && step >= 4 ? route.storage : [waiting("storage")],
    },
  ];

  return (
    <div className="px-4 py-6">
      <div className="mx-auto grid w-max min-w-full grid-cols-[1fr_auto_1fr]">
        <p className="flex items-center justify-end gap-1.5 self-center pr-3 font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase">
          <span className="size-1.5 bg-accent" />
          Unity Catalog
        </p>
        <span className="size-10 justify-self-center self-center bg-foreground" />
        <p className="invisible pr-3 font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase" aria-hidden>
          Unity Catalog
        </p>
        {layers.map((layer, index) => {
          return (
            <Fragment key={layer.id}>
              <p className="mt-6 pr-3 text-right font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap text-accent uppercase">
                {layer.title}
              </p>
              <div className="flex flex-col items-center">
                <span className="h-6 w-px shrink-0 bg-foreground" />
                <div
                  className={`grid w-72 shrink-0 gap-3 border bg-surface px-3 py-3 text-center ${
                    layer.accent ? "border-accent" : "border-foreground"
                  }`}
                >
                  {layer.items.map((item) => (
                    <div key={item.id}>
                      <p className={`font-mono text-[0.65rem] tracking-[-0.01em] uppercase ${item.note ? "" : "text-faint"}`}>
                        {item.label}
                      </p>
                      {item.note ? (
                        <p className="mt-1 text-left text-sm leading-relaxed text-faint">
                          <span className="mb-0.5 block font-mono text-[0.6rem] tracking-[-0.01em] text-accent uppercase">Why</span>
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {index < layers.length - 1 ? <span className="w-px flex-1 bg-foreground" /> : null}
              </div>
              <p className="invisible mt-6 pr-3 text-right font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase" aria-hidden>
                {layer.title}
              </p>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function emphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function Description({ route, step }: { route: Route | null; step: number }) {
  const beats = route?.story?.filter((beat) => beat.at <= step) ?? [];
  if (!route) {
    return (
      <p className="p-4 text-sm leading-relaxed text-faint">
        Choose a workflow. This side names each system that opens, and what happens to it.
      </p>
    );
  }
  if (!route.setup && beats.length === 0) {
    return <p className="p-4 text-sm leading-relaxed text-faint">The systems are opening.</p>;
  }
  const setup = route.setup
    ? [
        ["Setup", route.setup.overview],
        ["Time", route.setup.time],
        ["Departments", route.setup.departments],
        ["Handoff", route.setup.handoff],
      ]
    : [];
  return (
    <div className="grid content-start gap-3 p-4">
      {setup.map(([label, text]) => (
        <article key={label} className="border border-line px-3 py-3">
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{label}</p>
          <p className="mt-2 text-sm leading-relaxed text-faint">
            {label === "Setup" ? emphasis(text) : text}
          </p>
        </article>
      ))}
      {beats.map((beat) => (
        <article key={beat.id} className="border border-line px-3 py-3">
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">
            {beat.system}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-faint">{beat.text}</p>
        </article>
      ))}
    </div>
  );
}

type OperateId = "diagram" | "description" | "map";

const setupColumns: {
  access: { id: string; label: string };
  control: { id: string; label: string; detail: string; more: string };
  compute: { id: string; label: string; detail: string; more: string } | null;
  storage: { id: string; label: string; detail: string; more: string } | null;
}[] = [
  {
    access: { id: "engineers", label: "Data engineers" },
    control: { id: "jobs", label: "Lakeflow jobs", detail: "Designer and notebooks", more: "Writes the tables" },
    compute: { id: "spark", label: "Spark clusters", detail: "Distributed processing", more: "Runs jobs at scale" },
    storage: { id: "delta", label: "Delta Lake, Iceberg", detail: "Open table formats", more: "One copy, many readers" },
  },
  {
    access: { id: "analysts", label: "Analysts and BI tools" },
    control: { id: "genie", label: "Genie and AI/BI", detail: "Dashboards, metric views", more: "Questions become SQL" },
    compute: { id: "warehouse", label: "Databricks SQL", detail: "Warehouse queries", more: "Reads the same tables" },
    storage: null,
  },
  {
    access: { id: "ai-apps", label: "AI apps and agents" },
    control: { id: "gateway", label: "Agent Bricks", detail: "AI Gateway routing", more: "Logs every model call" },
    compute: { id: "serving", label: "Model serving", detail: "Foundation model APIs", more: "Answers one request" },
    storage: { id: "models", label: "MLflow, Vector Search", detail: "Registry and embeddings", more: "Search the documents" },
  },
  {
    access: { id: "apps", label: "Business apps" },
    control: { id: "apps", label: "Databricks Apps", detail: "Hosted web apps", more: "Inherit catalog rights" },
    compute: null,
    storage: { id: "lakebase", label: "Lakebase Postgres", detail: "Managed Postgres", more: "Synced to Delta" },
  },
];

function pieceOn(route: Route | null, layer: "access" | "control" | "compute" | "storage", id: string) {
  return route?.[layer].find((item) => item.id === id) ?? null;
}

function SetupMap({
  route,
  step,
  expanded = false,
}: {
  route: Route | null;
  step: number;
  expanded?: boolean;
}) {
  function on(layer: "access" | "control" | "compute" | "storage", id: string) {
    if (!route) return false;
    const min = layer === "access" ? 1 : layer === "control" ? 2 : layer === "compute" ? 3 : 4;
    return step >= min && Boolean(pieceOn(route, layer, id));
  }

  const catalogOn = Boolean(route && step >= 1);

  function card(
    layer: "access" | "control" | "compute" | "storage",
    node: { id: string; label: string; detail?: string; more?: string },
  ) {
    const active = on(layer, node.id);
    const why = active ? pieceOn(route, layer, node.id)?.note : "";
    return (
      <div
        className={`border bg-surface text-center ${expanded ? "px-3 py-3" : "px-1 py-1.5"} ${
          active ? "border-foreground" : route ? "border-line opacity-35" : "border-line"
        }`}
      >
        <p className={`font-mono uppercase leading-tight ${expanded ? "text-[0.7rem]" : "text-[0.55rem]"}`}>
          {node.label}
        </p>
        {expanded && node.detail ? (
          <p className="mt-2 text-sm leading-snug text-faint">
            {node.detail}. {node.more}.
          </p>
        ) : null}
        {expanded && why ? <p className="mt-2 text-left text-sm leading-relaxed text-faint">{why}</p> : null}
      </div>
    );
  }

  const band = expanded ? "px-3 py-4" : "px-1.5 py-2";

  return (
    <div className="grid min-w-[36rem] gap-3">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Access</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) => (
            <div key={column.access.id}>{card("access", column.access)}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Control</p>
          <p className={`mt-3 font-mono uppercase leading-tight ${catalogOn ? "text-accent" : "text-faint"} ${expanded ? "text-[0.7rem]" : "text-[0.55rem]"}`}>
            Unity Catalog
          </p>
          {expanded ? <p className="mt-1 text-sm leading-snug text-faint">Permission fabric. Checks every query.</p> : null}
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) => (
            <div key={column.control.id + column.access.id}>{card("control", column.control)}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Compute</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) =>
            column.compute ? (
              <div key={column.compute.id}>{card("compute", column.compute)}</div>
            ) : (
              <div key={column.access.id} />
            ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Storage</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) =>
            column.storage ? (
              <div key={column.storage.id}>{card("storage", column.storage)}</div>
            ) : (
              <div key={column.access.id} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function windowOrigin() {
  const width = Math.min(44 * 16, window.innerWidth - 32);
  return {
    x: Math.max(16, window.innerWidth - width - 12),
    y: 88,
  };
}

function MapView({
  route,
  step,
  onClose,
}: {
  route: Route | null;
  step: number;
  onClose: () => void;
}) {
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [size, setSize] = useState({ width: 704, height: 560 });
  const [playStep, setPlayStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const playTimers = useRef<number[]>([]);
  const close = useRef(onClose);
  close.current = onClose;
  const shown = playStep ?? step;

  function stopPlay() {
    playTimers.current.forEach((timer) => window.clearTimeout(timer));
    playTimers.current = [];
  }

  function schedule(from: number) {
    const marks = [1, 2, 3, 4].filter((mark) => mark > from);
    if (marks.length === 0) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    marks.forEach((mark, index) => {
      playTimers.current.push(
        window.setTimeout(() => {
          setPlayStep(mark);
          if (mark === 4) setPlaying(false);
        }, 1000 * (index + 1)),
      );
    });
  }

  function play() {
    if (!route) return;
    if (playing) {
      stopPlay();
      setPlaying(false);
      return;
    }
    stopPlay();
    const from = playStep === null || playStep >= 4 ? 0 : playStep;
    if (from === 0) setPlayStep(0);
    schedule(from);
  }

  useLayoutEffect(() => {
    const width = Math.min(44 * 16, window.innerWidth - 32);
    const height = Math.min(640, window.innerHeight - 112);
    setPos(windowOrigin());
    setSize({ width, height });
  }, []);

  useEffect(() => {
    stopPlay();
    setPlayStep(null);
    setPlaying(false);
  }, [route]);

  useEffect(() => stopPlay, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const width = panel.current?.offsetWidth ?? 320;
    const nextX = event.clientX - drag.current.dx;
    const nextY = event.clientY - drag.current.dy;
    setPos({
      x: Math.min(window.innerWidth - 120, Math.max(16 - width + 120, nextX)),
      y: Math.min(window.innerHeight - 48, Math.max(0, nextY)),
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function onResizeDown(event: React.PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resize.current = { x: event.clientX, y: event.clientY, w: size.width, h: size.height };
  }

  function onResizeMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!resize.current) return;
    const maxW = window.innerWidth - pos.x - 12;
    const maxH = window.innerHeight - pos.y - 12;
    setSize({
      width: Math.min(maxW, Math.max(420, resize.current.w + event.clientX - resize.current.x)),
      height: Math.min(maxH, Math.max(280, resize.current.h + event.clientY - resize.current.y)),
    });
  }

  function onResizeUp() {
    resize.current = null;
  }

  return createPortal(
            <div
                ref={panel}
                role="dialog"
                aria-modal="false"
                aria-label="Setup diagram for this workflow"
                className="fixed z-[40] flex flex-col border border-foreground bg-background shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                style={{ left: pos.x, top: pos.y, width: size.width, height: size.height }}
              >
                <div
                  className="flex shrink-0 cursor-grab touch-none items-center justify-between gap-4 border-b border-line px-5 py-3 active:cursor-grabbing"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">This workflow on the setup</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={play}
                      disabled={!route}
                      className="h-[31px] cursor-pointer bg-foreground px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] text-background uppercase disabled:cursor-default disabled:opacity-40"
                    >
                      {playing ? "Pause" : "Play"}
                    </button>
                    <button
                      type="button"
                      onClick={() => close.current()}
                      className="h-[31px] cursor-pointer border border-line bg-background px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-auto p-4">
                  <SetupMap route={route} step={shown} expanded />
                </div>
                <div
                  aria-label="Resize diagram"
                  className="absolute right-0 bottom-0 z-10 h-5 w-5 cursor-nwse-resize"
                  onPointerDown={onResizeDown}
                  onPointerMove={onResizeMove}
                  onPointerUp={onResizeUp}
                >
                  <span className="absolute right-1 bottom-1 block h-2 w-2 border-r border-b border-foreground" />
                </div>
            </div>,
    document.body,
  );
}

function OperateToggle({
  value,
  onSelect,
}: {
  value: OperateId | null;
  onSelect: (id: OperateId) => void;
}) {
  return (
    <div className="inline-flex max-w-full shrink-0 flex-wrap border border-line" role="group" aria-label="How the workflow runs">
      {(
        [
          { id: "diagram", label: "Trajectory" },
          { id: "description", label: "Description" },
        ] as const
      ).map((item, index) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(item.id)}
            className={`h-[31px] shrink-0 whitespace-nowrap px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${
              index > 0 ? "border-l border-line" : ""
            } ${selected ? "bg-foreground text-background" : "bg-surface text-muted"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function DiagramTab({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={open}
      onClick={onClick}
      className={`h-[31px] shrink-0 border border-line px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${
        open ? "bg-foreground text-background" : "bg-surface text-muted"
      }`}
    >
      Diagram
    </button>
  );
}

export function TtsDemo({ label = "Use Cases" }: { label?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(0);
  const [choice, setChoice] = useState<OperateId | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const operateView = choice === "description" ? "description" : "diagram";
  const run = useRef(0);
  const timers = useRef<number[]>([]);
  const thread = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previousBehavior;

    function fit() {
      const el = frame.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.minHeight = `${Math.max(0, Math.ceil(window.innerHeight - top - 24))}px`;
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function choose(id: OperateId) {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setChoice((current) => (desktop || current !== id ? id : null));
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const el = thread.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, [messages, step]);

  function ask(text: string, next: Route) {
    const trimmed = text.trim();
    if (!trimmed) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const id = ++run.current;
    setRoute(next);
    setStep(0);
    setPlay((current) => current + 1);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "person", text: trimmed },
    ]);
    [1, 2, 3, 4].forEach((mark, index) => {
      const timer = window.setTimeout(() => {
        if (run.current !== id) return;
        setStep(mark);
        if (mark === 4) {
          setMessages((current) => [
            ...current,
            { id: nextId.current++, role: "platform", text: next.reply },
          ]);
        }
      }, 450 * (index + 1));
      timers.current.push(timer);
    });
  }

  return (
    <>
      <div className="grid min-w-0 items-end gap-4 *:min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="flex min-w-0 items-end gap-3 lg:block">
          <div className="min-w-0">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
              {label}
            </p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
            <OperateToggle value={choice === "map" ? null : choice} onSelect={choose} />
            <DiagramTab open={mapOpen} onClick={() => setMapOpen(true)} />
          </div>
        </div>
        <p className="hidden font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase lg:block">
          How the workflow runs
        </p>
      </div>
      <div ref={frame} className="relative mt-3 flex flex-col">
        <div className="pointer-events-none invisible hidden lg:block" aria-hidden>
          <div className="border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line p-3">
              <OperateToggle value="diagram" onSelect={() => {}} />
              <DiagramTab open={false} onClick={() => {}} />
            </div>
            <FlowDiagram route={null} step={0} />
          </div>
        </div>
        <div className="grid min-h-0 w-full flex-1 items-stretch gap-4 lg:absolute lg:inset-0 lg:h-full lg:grid-rows-1 lg:overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className={`flex h-full min-h-0 flex-col overflow-hidden border border-line bg-surface ${choice !== null ? "max-lg:hidden" : ""}`}>
            <div className="flex shrink-0 flex-wrap gap-2 border-b border-line p-3">
              {samples.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => ask(sample.query, sample.route)}
                  className="border border-line px-3 py-2 text-left text-sm hover:border-foreground"
                >
                  {sample.label}
                </button>
              ))}
            </div>
            <div ref={thread} className="grid h-0 min-h-0 flex-1 content-start gap-3 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-sm leading-relaxed text-faint">
                  Choose a workflow. The path shows who starts it, the product that runs it, the compute it uses, and where the data is stored.
                </p>
              ) : (
                messages.map((message) => (
                  <p
                    key={message.id}
                    className={`max-w-[36rem] border px-3 py-2 text-sm leading-relaxed ${
                      message.role === "person"
                        ? "justify-self-end border-foreground"
                        : "border-line text-faint"
                    }`}
                  >
                    <span className="mb-1 block font-mono text-[0.65rem] tracking-[-0.01em] uppercase">
                      {message.role === "person" ? "You" : "Platform"}
                    </span>
                    {message.text}
                  </p>
                ))
              )}
            </div>
          </div>

          <aside
            className={`flex h-full min-h-0 flex-col overflow-hidden border border-line bg-surface ${choice === null ? "hidden lg:flex" : ""}`}
            aria-live="polite"
          >
            <div className="hidden shrink-0 items-center justify-between gap-3 border-b border-line p-3 lg:flex">
              <OperateToggle value={operateView} onSelect={choose} />
              <DiagramTab open={mapOpen} onClick={() => setMapOpen(true)} />
            </div>
            <div className="h-0 min-h-0 min-w-0 max-w-full flex-1 overflow-auto overscroll-contain">
              <div className={operateView === "diagram" ? "" : "hidden"}>
                <FlowDiagram key={play} route={route} step={step} />
              </div>
              <div className={operateView === "description" ? "" : "hidden"}>
                <Description route={route} step={step} />
              </div>
            </div>
            {mapOpen ? <MapView route={route} step={step} onClose={() => setMapOpen(false)} /> : null}
          </aside>
        </div>
      </div>
    </>
  );
}
