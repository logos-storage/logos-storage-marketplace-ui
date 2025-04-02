import { useState } from "react";
import { OnBoardingLayout } from "../components/OnBoarding/OnBoardingLayout";
import { attributes } from "../utils/attributes";
import ArrowRightCircle from "../assets/icons/arrow-circle.svg?react";
import { UserInfo } from "../components/UserInfo/UserInfo";
import { WebStorage } from "../utils/web-storage";
import AlphaIcon from "../assets/icons/alpha.svg?react";
import { useNavigate } from "react-router-dom";

export const OnBoardingNameRoute = () => {
  const [isStepValid, setIsStepValid] = useState(
    !!WebStorage.onBoarding.getDisplayName()
  );
  const navigate = useNavigate();

  const onNameChange = (value: string) => setIsStepValid(!!value);

  const onNextStep = () => {
    if (isStepValid) {
      navigate("/onboarding-checks");
    }
  };

  return (
    <OnBoardingLayout defaultIsStepValid={false} step={1}>
      <>
        <section className="alpha">
          <div>
            <AlphaIcon color="var(--codex-color-primary)" width={26} />
          </div>
          <p>Personalization</p>
        </section>
        <section className="main">
          <h1>
            Let’s get you setup. <br />
            What do you want to be called?
          </h1>

          <UserInfo onNameChange={onNameChange} onEnterPressed={onNextStep} />
        </section>

        <a
          className="navigation"
          onClick={onNextStep}
          {...attributes({ "aria-disabled": !isStepValid })}>
          <ArrowRightCircle></ArrowRightCircle>
        </a>
      </>
    </OnBoardingLayout>
  );
};
