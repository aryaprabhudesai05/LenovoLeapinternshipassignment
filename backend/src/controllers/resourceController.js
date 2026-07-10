import Resource from "../models/Resource.js";
import { mockData } from "../utils/mockData.js";
import { parsePagination, withId } from "../utils/pagination.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getResources = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 20, maxLimit: 100 });
  let resources = await Resource.find().skip(skip).limit(limit).lean();
  let total = await Resource.countDocuments();

  if (!resources.length) {
    const seeded = mockData.resources().resources;
    total = seeded.length;
    resources = seeded.slice(skip, skip + limit);
  }

  res.json({
    resources: resources.map(withId),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});
