export default async function (_input, context) {
    const tableId = context.tables.bangumi.id;
    const fieldMap = context.tables.bangumi.fieldsMap;
    if (!context.env.BILIBILI_ID) {
        console.warn("Please set BILIBILI_ID in env");
        return;
    }
    const url = `https://bangumi-manager.gine.workers.dev/${context.env.BILIBILI_ID}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const table = eidos.currentSpace.table(tableId);
    for (const item of data.result) {
        await table.rows.create({
            [fieldMap.title]: item.title,
            [fieldMap.subtitle]: item.subtitle,
            [fieldMap.cover]: item.cover,
            [fieldMap.summary]: item.evaluate,
            [fieldMap.media_id]: item.media_id,
        }, {
            useFieldId: true,
        });
        console.log(`add ${item.title}`);
    }
}
