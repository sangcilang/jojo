import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders store branding", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      products: [],
      categories: [],
      featured: [],
      credentialsHint: { admin: {}, user: {}, locked: {} },
    }),
  });
  render(<App />);
  expect(await screen.findByText(/Zanee\.Store/i)).toBeInTheDocument();
});
