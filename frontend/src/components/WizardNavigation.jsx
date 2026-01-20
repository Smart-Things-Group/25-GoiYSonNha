function WizardNavigation({
  onBack = () => {},
  onNext = () => {},
  disableBack = false,
  disableNext = false,
  backLabel = "Quay lại",
  nextLabel = "Tiếp tục",
  nextLoading = false,
  secondaryRight = null,
  primaryRight = null,
}) {
  return (
    <div className="wizard-nav">
      <div className="wizard-nav__left">
        <button
          type="button"
          onClick={onBack}
          disabled={disableBack || nextLoading}
          className="btn btn-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {backLabel}
        </button>
      </div>
      
      <div className="wizard-nav__right">
        {secondaryRight}
        {primaryRight ?? (
          <button
            type="button"
            onClick={onNext}
            disabled={disableNext || nextLoading}
            className={`btn btn-primary${nextLoading ? " btn--loading" : ""}`}
          >
            {nextLoading ? (
              <>
                <span className="btn__spinner" />
                Đang xử lý...
              </>
            ) : (
              <>
                {nextLabel}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default WizardNavigation;
