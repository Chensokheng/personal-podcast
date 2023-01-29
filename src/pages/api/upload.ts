// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import formidable from "formidable";
import fs from "fs";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supabase = createServerSupabaseClient({ req, res });
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return res.status(401).json({
			error: "not_authenticated",
			description:
				"The user does not have an active session or is not authenticated",
		});
	}
	if (req.method === "GET") {
		return res.status(200).json({});
	}

	const fdata: any = await new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			if (err) reject({ err });
			resolve({ err, fields, files });
		});
	});

	const filecontent = fs.readFileSync(fdata.files.filepond.filepath);
	const filename = fdata.files.filepond.originalFilename;
	const bucket = req.query.bucket as string;

	if (!bucket) {
		return res.status(404).json({ message: "bucket not found" });
	}

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(`private/${filename}`, filecontent, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		return res.status(500).send({
			message: "This is an error!",
		});
	}

	const { data: dataUrl } = supabase.storage
		.from(bucket)
		.getPublicUrl(data.path);

	res.status(200).json({ path: data.path, url: dataUrl.publicUrl });
}
