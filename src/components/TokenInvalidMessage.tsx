import React from "react";
import notFoundImg from "../../public/images/error.svg";
import Image from "next/image";
const TokenInvalidMessage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-6 rounded-md text-center flex flex-col items-center">
        <Image
          src={notFoundImg}
          alt="Descriptive Alt Text"
          className="mx-auto h-80"
        />
        <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Token Invalid or Expired
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600">
          We are sorry, but the link you have clicked on is no longer valid. This
          could have happened for a few reasons:
        </p>

        <ul className="mt-4 text-gray-600 flex flex-col items-start">
          <li className="list-none">
            <span className="font-bold">The token has expired:</span>
            <span className="ml-1">
              For security reasons, registration links are only valid for a
              limited period of time.
            </span>
          </li>
          <li className="list-none">
            <span className="font-bold">The token is invalid:</span>
            <span className="ml-1">
              The link might have been altered or corrupted.
            </span>
          </li>
        </ul>

        <h3 className="mt-6 text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          What can you do?
        </h3>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
          If you received this link from an administrator or a colleague, please
          contact them to request a new registration link.
        </p>
      </div>
    </div>
  );
};

export default TokenInvalidMessage;
