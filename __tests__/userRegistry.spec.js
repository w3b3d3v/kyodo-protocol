import { act, render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import App from "../src/App";

describe("UserRegistry", () => {
  xit("displays the signIn form after the user connects their wallet", async () => {
    const mockAccounts = ["0x0BB56447B1e484C3486AC033a2A1DDE4f13efEF5"];
    window.ethereum = {
      request: jest.fn(() => Promise.resolve(mockAccounts[0])),
      isMetaMask: true
    };

    render(<App />);

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
    
    const nameInput = screen.getByLabelText('Nome:');
    const whatsappInput = screen.getByLabelText('Whatsapp:');
    const valueInput = screen.getByLabelText('Valor:');
    const submitButton = screen.getByText('Cadastrar');
    expect(nameInput).toBeInTheDocument();
    expect(whatsappInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  xit('unregistered users must see the form to register in the blockchain', async () => {
    const mockEthereum = {
      isMetaMask: true,
      selectedAddress: '0xCf48d9ae072758c125804791Cf8c4D390B460c19',
      networkVersion: '80001',
      request: jest.fn(() => Promise.resolve(["0xCf48d9ae072758c125804791Cf8c4D390B460c19"])),
      enable: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    window.ethereum = mockEthereum;

    // Arrange: render the app
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
    
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      const whatsappInput = screen.getByLabelText(/whatsapp/i);
      const submitButton = screen.getByRole("button", {
        name: "Cadastrar"
      });
      expect(nameInput).toBeInTheDocument();
      expect(whatsappInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });
});