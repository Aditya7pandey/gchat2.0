import Spline from '@splinetool/react-spline';

export default function Robot() {
  return (
    <div className="w-150 h-130 overflow-hidden">
      <Spline scene="https://prod.spline.design/BOmd7z4j9pHe1Xv1/scene.splinecode" />
      <style>
        {`
          .spline-logo {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
