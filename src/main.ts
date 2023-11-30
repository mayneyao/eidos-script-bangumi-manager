import { Eidos, EidosTable } from "@eidos.space/types";

declare const eidos: Eidos;

interface Env {
  // add your environment variables here
  BILIBILI_ID: string;
}

interface Table {
  // add your tables here
  bangumi: EidosTable<{
    title: string;
    cover: string;
    summary: string;
    media_id: string;
  }>;
}

interface Input {
  // add your input fields here
  content: string;
}

interface Context {
  env: Env;
  tables: Table;
  currentRowId?: string;
}

export default async function (_input: Input, context: Context) {
  const tableId = context.tables.bangumi.id;
  const fieldMap = context.tables.bangumi.fieldsMap;
  if (!context.env.BILIBILI_ID) {
    console.warn("Please set BILIBILI_ID in env");
    return;
  }
  const url = `https://bangumi-manager.gine.workers.dev/${context.env.BILIBILI_ID}`;
  const resp = await fetch(url);
  const data = await resp.json();

  for (const item of data) {
    await eidos.currentSpace.table(tableId).rows.create(
      {
        [fieldMap.title]: item.title,
        [fieldMap.cover]: item.cover,
        [fieldMap.summary]: item.evaluate,
        [fieldMap.media_id]: item.media_id,
      },
      {
        useFieldId: true,
      }
    );
    console.log(`add ${item.title}`);
  }
}
