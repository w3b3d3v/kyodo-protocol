import { act, render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import App from "../src/App";

const mockEthereum = {
  isMetaMask: true,
  selectedAddress: '0x0BB56447B1e484C3486AC033a2A1DDE4f13efEF5',
  networkVersion: '1',
  request: jest.fn(() => Promise.resolve(["0x0BB56447B1e484C3486AC033a2A1DDE4f13efEF5"])),
  enable: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

describe("ConnectWalletButton", () => {
  it("displays the connect wallet button if the user has not connected their wallet", () => {
    // Simulando a presença do objeto `window.ethereum`
    window.ethereum = mockEthereum;

    act(() => {
      render(<App />);
    });

    const connectButton = screen.getByRole("button", {
      name: "Conectar carteira"
    });

    expect(connectButton).toBeInTheDocument();
  });

  it("does not display the connect wallet button if the user has connected their wallet", async () => {
    window.ethereum = mockEthereum;

    act(() => {
      render(<App />);
    });

    const connectButton = screen.getByRole("button", {
      name: "Conectar carteira"
    });
    fireEvent.click(connectButton);

    await waitFor(() => {
        const connectButtonPresent = screen.queryByRole("button", {
          name: "Conectar carteira"
        });
        expect(connectButtonPresent).not.toBeInTheDocument();
    });
  });
});
