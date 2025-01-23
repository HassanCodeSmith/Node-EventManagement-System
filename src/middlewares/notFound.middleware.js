export const notFound = (req, res) => {
  console.error("Route does not exist.");
  return res.status(404).json({
    success: false,
    message: "Route does not exist.",
  });
};
