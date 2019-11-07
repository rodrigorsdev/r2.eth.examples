pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract Strings {
    
    function length(
        string memory str
    ) pure 
      public 
      returns(uint)
    {
      bytes memory strBytes = bytes(str);
      return strBytes.length;
    }

    function concatenate(
        string memory str1,
        string memory str2
    ) pure
      public
      returns(string memory)
    {
        bytes memory str1Bytes = bytes(str1);
        bytes memory str2Bytes = bytes(str2);
        string memory str = new string(str1Bytes.length + str2Bytes.length);
        bytes memory strTotalBytes = bytes(str);
        uint j = 0;

        for (uint i = 0; i < str1Bytes.length; i++) {
            strTotalBytes[i] = str1Bytes[i];
            j++;
        }

         for (uint i = 0; i < str2Bytes.length; i++) {
            strTotalBytes[j] = str2Bytes[i];
            j++;
        }

        return string(strTotalBytes);
    }

    function concatenate(
        string[] memory strs
    ) pure
      public
      returns(string memory)
    {
        bytes[] memory strsBytes;

        for (uint i = 0; i < strs.length; i++) {
            bytes memory strBytes = bytes(strs[i]);
            strsBytes[i] = strBytes;
        }

        uint j = 0;

        uint totalLengths = 0;
        for (uint i = 0; i < strsBytes.length; i++) {
            totalLengths = totalLengths + strsBytes[i].length;
        }

        string memory str = new string(totalLengths);
        bytes memory strResult = bytes(str);

        for (uint i = 0; i < strsBytes.length; i++) {
            for (uint m = 0; m < strsBytes[i].length; m++) {
                strResult[j] = strsBytes[i][m];
            }
        }

        return string(strResult);
     }
}