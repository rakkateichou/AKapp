package com.diploma.util

import java.util.*
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

// класс для шифрования и дешифрования данных
object AESEncryption {

    const val secretKey = "aGloaWhp"
    const val salt = "QWlGNHNhMTJTQWZ2bGhpV3U="

    // шифрование
    fun encrypt(strToEncrypt: String) :  String?
    {
        try
        {
            val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")
            val spec =  PBEKeySpec(secretKey.toCharArray(), Base64.getDecoder().decode(salt), 10000, 256)
            val tmp = factory.generateSecret(spec)
            val secretKey =  SecretKeySpec(tmp.encoded, "AES")

            val cipher = Cipher.getInstance("AES")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
            return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.toByteArray(Charsets.UTF_8)))
        }
        catch (e: Exception)
        {
            println("Error while encrypting: $e")
        }
        return null
    }

    // дешифрование
    fun decrypt(strToDecrypt : String) : String? {
        try
        {
            val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")
            val spec =  PBEKeySpec(secretKey.toCharArray(), Base64.getDecoder().decode(salt), 10000, 256)
            val tmp = factory.generateSecret(spec);
            val secretKey =  SecretKeySpec(tmp.encoded, "AES")

            val cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return  String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)))
        }
        catch (e : Exception) {
            println("Error while decrypting: $e");
        }
        return null
    }
}