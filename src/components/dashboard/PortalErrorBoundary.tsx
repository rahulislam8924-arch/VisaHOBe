import React from 'react';

interface State {
  error: Error | null;
}

/**
 * Safe error handling for the client portal: a failing view never leaks a stack
 * trace or another client's data — it shows a neutral recovery card instead.
 */
export class PortalErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch() {
    // In development the error is reported to the console only.
    if (typeof console !== 'undefined') {
      console.warn('[VisaHOBe portal] a view failed to render; details withheld from the client UI');
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg rounded-[28px] border border-black/[0.06] bg-white/80 p-6 text-center">
          <span className="material-icons text-3xl text-[#c5221f]">error_outline</span>
          <h2 className="mt-2 text-lg font-medium text-[#1f1f1f]">This section could not be shown</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#5f6368]">
            Nothing was lost — your records are stored safely. Reload the section to try again.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-3 rounded-full bg-[#0b57d0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0842a0] cursor-pointer"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
