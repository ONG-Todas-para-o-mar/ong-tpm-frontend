import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="wrap" style={{ padding: "96px 0", textAlign: "center" }}>
          <span className="eyebrow">Erro inesperado</span>
          <h1 className="display" style={{ fontSize: 40, margin: "16px 0 12px" }}>
            Algo deu errado.
          </h1>
          <p style={{ color: "var(--ink-3)", maxWidth: 480, margin: "0 auto 24px" }}>
            A página encontrou um problema. Tente recarregar — se persistir, fale com o suporte.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recarregar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
