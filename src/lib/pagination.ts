export const pagination = {
  paginate: (
    page: number | string = 1,
    limit: number | string = 10
  ) => {
    const pageNumber = typeof page === "string" ? parseInt(page) : page;
    const limitNumber = typeof limit === "string" ? parseInt(limit) : limit;

    const skip = (pageNumber - 1) * limitNumber;

    return {
      page: pageNumber,
      limit: limitNumber,
      skip,
    };
  },

  meta: (
    total: number,
    page: number,
    limit: number
  ) => {
    const lastPage = Math.ceil(total / limit);

    return {
      current_page: page,
      per_page: limit,
      total,
      last_page: lastPage,
      from: total > 0 ? (page - 1) * limit + 1 : 0,
      to: Math.min(page * limit, total),
      has_more_pages: page < lastPage,
    };
  },
};